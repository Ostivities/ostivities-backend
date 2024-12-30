import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BulkEmailDto } from 'src/bulk_email/dto/email.dto';
import { Discounts } from 'src/discount/schema/discount.schema';
import { Events } from 'src/event/schema/event.schema';
import { CreateOrderEmailDto } from 'src/templates/dto/ticketpurchase.dto';
import { TicketPurchase } from 'src/templates/ticketPurchase';
import { TicketOrderPurchase } from 'src/templates/ticketReceipt';
import { Ticket } from 'src/ticket/schema/ticket.schema';
import {
  formatNumber,
  generateOrderNumber,
  getFormattedDate,
} from 'src/util/helper';
import { CHECK_IN_STATUS, EVENT_TYPE, TICKET_STOCK } from 'src/util/types';
import { GuestDto } from './dto/guests.dto';
import { Guests } from './schema/guests.schema';
import { pdfGenerator } from '../util/pdf';
import { PdfDto } from '../util/dto/pdf.dto';
import { OSTIVITIES_LOGO } from '../util/logo';
import { TICKET_BANNER } from '../util/ticketBanner';
import { BulkEmailGuestDto } from './dto/guest_bulk_email.dto';
import { BulkEmailService } from 'src/bulk_email/bulk_email.service';
import { AttendeeDto } from './dto/attendees.dto';
import { guestEmail } from '../templates/guest';

// Net sales Revenue = Sales revenue - Fees
// Sales revenue = fee + ticket price*qty

@Injectable()
export class GuestsService {
  constructor(
    @InjectModel(Ticket.name) private ticketModel: Model<Ticket>,
    @InjectModel(Events.name) private eventModel: Model<Events>,
    @InjectModel(Guests.name) private guestModel: Model<Guests>,
    @InjectModel(Discounts.name) private discountModel: Model<Discounts>,
    private emailService: BulkEmailService,
  ) {}

  async register(dto: GuestDto, eventId: string): Promise<any> {
    const order_number = `ORD${generateOrderNumber()}`;

    const eventData: any = await this.eventModel
      .findById(eventId)
      .populate({ path: 'user', select: 'email' });

    if (!eventData) {
      throw new ForbiddenException('Event not found');
    }

    if (dto.ticket_information.length > 0) {
      let total_sales_revenue = 0;
      let ticket_sales_revenue = 0;
      let ticket_net_sales_revenue = 0;
      for (const ticket_information of dto.ticket_information) {
        const ticket = await this.ticketModel.findOne({
          _id: ticket_information.ticket_id,
        });

        if (!ticket) {
          throw new ForbiddenException(
            `${ticket_information.ticket_name} not found`,
          );
        }

        if (
          ticket.ticketQty < ticket_information.quantity &&
          ticket_information.ticket_stock === TICKET_STOCK.LIMITED
        ) {
          console.log(ticket.ticketQty, 'Q1');
          console.log(ticket_information.quantity, 'Q2');
          throw new ForbiddenException(
            `Not enough tickets available for ${ticket_information.ticket_name}`,
          );
        }

        if (ticket.ticketQty <= 0) {
          throw new ForbiddenException(
            `${ticket_information.ticket_name} sold out`,
          );
        }

        // calculate ticket quantity left
        const newTicketQty =
          ticket.ticket_available - ticket_information.quantity;
        const newTicketSold = ticket.ticket_sold + ticket_information.quantity;

        // const ticket_available =
        //   newTicketQty === 0 ? 0 : ticket.ticketQty - newTicketSold;

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        total_sales_revenue +=
          eventData.total_sales_revenue + dto.total_amount_paid;
        //
        // ticket_sales_revenue +=
        //   dto.fees +
        //   ticket_information.total_amount +
        //   ticket.ticket_sales_revenue;

        ticket_sales_revenue +=
          newTicketSold * ticket_information.ticket_price + dto.fees;
        //
        // ticket_net_sales_revenue +=
        //   ticket_sales_revenue - dto.fees + ticket.ticket_net_sales_revenue;

        ticket_net_sales_revenue += ticket_sales_revenue - dto.fees;

        if (ticket.ticketQty - ticket.ticket_sold === 0) {
          ticket.ticket_available = 0;
        } else {
          ticket.ticket_available +=
            ticket.ticket_available + ticket_information.quantity;
        }
        await this.ticketModel.findOneAndUpdate(
          { _id: ticket_information.ticket_id },
          {
            $set: {
              // ticketQty: newTicketQty,
              ticket_sold: newTicketSold,
              ticket_available:
                ticket_information.ticket_stock === TICKET_STOCK.LIMITED
                  ? newTicketQty
                  : 0,
              // map fees from fees api
              fees: dto.fees,
              ticket_sales_revenue,
              ticket_net_sales_revenue,
            },
          },
          { new: true },
        );
      }
    }

    // filter dto if attendees info exist
    const filter_payload = (payload: GuestDto) => {
      if (
        payload.attendees_information &&
        payload.attendees_information.length > 0
      ) {
        // Remove attendees_information from the payload
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { attendees_information, ...filteredPayload } = payload;
        return filteredPayload;
      }
      // Return the original payload if no attendees_information or it's empty
      return payload;
    };

    const newRegistration = new this.guestModel({
      ...filter_payload(dto),
      event: eventData?._id,
      check_in_status: CHECK_IN_STATUS.NOT_CHECKED_IN,
    });
    const savedGuest = await newRegistration.save();
    // SEND EMAIL TO PRY BUYER
    // GENERATE PDF AND SEND TO BUYER
    if (dto.ticket_information.length > 0 && dto.personal_information) {
      const total_pages: number = dto.ticket_information.reduce(
        (sum, ticket) => sum + ticket.quantity,
        0,
      );

      const combineTickets = (tickets: any): any => {
        const ticketMap: any = {};

        tickets.forEach((ticket) => {
          if (!ticketMap[ticket.ticket_id]) {
            ticketMap[ticket.ticket_id] = { ...ticket };
          } else {
            ticketMap[ticket.ticket_id].quantity += ticket.quantity;
          }
        });

        return Object.values(ticketMap);
      };

      const orderPurchase: CreateOrderEmailDto = {
        name: `${dto.personal_information.firstName} ${dto.personal_information.lastName}`,
        event_name: eventData.eventName,
        event_address: eventData.address,
        event_date_time: eventData.start_date_time
          ? eventData.start_date_time
          : eventData.startDate,
        order_number: order_number.toString(),
        order_date: getFormattedDate(),
        order_discount: dto.discount.toString(),
        order_subtotal: formatNumber(dto.total_amount_paid?.toString()),
        order_fees: formatNumber(dto.fees?.toString()),
        host_email: eventData?.user?.email,
        tickets: combineTickets(dto.ticket_information as any),
      };

      const content: PdfDto['content'] = dto.ticket_information.flatMap(
        (ticket) =>
          Array.from({ length: ticket.quantity }, () => {
            const {
              // order_number,
              order_date,
              event_date_time,
              event_address,
              event_name,
              name,
            } = orderPurchase;

            const qr_code = {
              event_id: eventData?._id,
              guest_id: savedGuest._id,
              order_number: ticket.order_number,
            };

            return {
              order_number: ticket.order_number,
              order_date,
              event_date_time,
              event_address,
              event_name,
              buyer_name: name,
              ticket_type: ticket.ticket_type,
              qr_code: JSON.stringify(qr_code),
              ostivities_logo: OSTIVITIES_LOGO,
              ticket_banner: TICKET_BANNER,
              ticket_name: ticket.ticket_name,
            };
          }),
      );

      const pdfDto: PdfDto = {
        order_date: getFormattedDate(),
        buyer_name: `${dto.personal_information.firstName} ${dto.personal_information.lastName}`,
        event_address: eventData.address,
        event_date_time: eventData.startDate,
        event_name: eventData.eventName,
        order_number: order_number.toString(),
        event_id: eventData?._id,
        buyer_id: savedGuest?._id as unknown as string,
        total_pages,
        content,
      };
      const pdfBase64 = await pdfGenerator(pdfDto);

      //   EMAIL CALL HERE
      await this.emailService.sendBulkEmail({
        sender_name: process.env.SMTP_SENDER_NAME,
        sender_email: process.env.SMTP_SALES_SENDER_EMAIL,
        reply_to: process.env.SMTP_SALES_SENDER_EMAIL,
        receipients: [
          {
            name: `${dto.personal_information.firstName} ${dto.personal_information.lastName}`,
            email: dto.personal_information.email,
          },
        ],
        email_subject: `Order`,
        email_content: TicketOrderPurchase(orderPurchase),
        email_attachment: [
          {
            content: pdfBase64,
            name: `${order_number}.pdf`,
          },
        ],
      });
    }

    // CALCULATE TICKET METRICS
    const tickets_metrics = await this.ticketModel
      .find({ event: eventData?._id })
      .select('ticket_sales_revenue ticket_net_sales_revenue ticket_sold')
      .exec();

    // SAVE AND UPDATE THE CALCULATED TICKET METRICS
    if (tickets_metrics) {
      const total_ticket_sold = tickets_metrics.reduce(
        (sum, ticket) => sum + ticket.ticket_sold,
        0,
      );

      const total_sales_revenue = tickets_metrics.reduce(
        (sum, ticket) => sum + ticket.ticket_sales_revenue,
        0,
      );

      await this.eventModel.findOneAndUpdate(
        { _id: eventData?._id },
        {
          $set: {
            total_ticket_sold: total_ticket_sold,
            total_sales_revenue: total_sales_revenue,
          },
        },
        { new: true },
      );
    }

    // REGISTER AND SAVE ATTENDEES IF THEY EXIST
    if (dto.attendees_information?.length > 0) {
      await this.registerAttendees(dto.attendees_information, eventData?._id);
    }

    return savedGuest;
  }

  async registerAttendees(dto: AttendeeDto[], event_id: string): Promise<any> {
    console.log('reg attendees');
    const eventData: any = await this.eventModel
      .findById(event_id)
      .populate({ path: 'user', select: 'email' });

    try {
      // check_in_status: CHECK_IN_STATUS.NOT_CHECKED_IN,
      const mappedGuests = dto.map((item) => {
        return {
          ...item,
          check_in_status: CHECK_IN_STATUS.NOT_CHECKED_IN,
          event: event_id,
        };
      });

      console.log(mappedGuests, 'mapped guests');

      const savedAttendees = await this.guestModel.insertMany(mappedGuests);

      console.log(savedAttendees, 'saved attendees');

      if (savedAttendees?.length > 0) {
        // Prepare email sending for each attendee
        const emailPromises = dto.map(async (attendeeInfo) => {
          if (!attendeeInfo.personal_information.email) return;

          // Find saved attendee data by email
          const savedAttendee = savedAttendees.find(
            (i) =>
              i.personal_information.email ===
              attendeeInfo.personal_information.email,
          );

          if (!savedAttendee) return;

          // Generate QR Code Data
          const qrCode = {
            event_id: eventData._id,
            guest_id: savedAttendee._id,
            order_number: attendeeInfo.ticket_information.order_number,
          };

          console.log(attendeeInfo, 'attendeeInfo');

          // Create PDF Content
          const content: PdfDto['content'] = [
            {
              order_number: attendeeInfo.ticket_information.order_number,
              order_date: getFormattedDate(),
              event_date_time: eventData.startDate,
              event_address: eventData.address,
              event_name: eventData.eventName,
              buyer_name: `${attendeeInfo.personal_information.firstName} ${attendeeInfo.personal_information.lastName}`,
              ticket_type: attendeeInfo.ticket_information.ticket_type,
              qr_code: JSON.stringify(qrCode),
              ostivities_logo: OSTIVITIES_LOGO,
              ticket_banner: TICKET_BANNER,
              ticket_name: attendeeInfo.ticket_information.ticket_name,
            },
          ];

          const pdfDto: PdfDto = {
            order_date: getFormattedDate(),
            buyer_name: `${attendeeInfo.personal_information.firstName} ${attendeeInfo.personal_information.lastName}`,
            event_address: eventData.address,
            event_date_time: eventData.startDate,
            event_name: eventData.eventName,
            order_number: attendeeInfo.ticket_information.order_number,
            event_id: eventData._id,
            buyer_id: savedAttendee._id.toString(),
            total_pages: 0,
            content,
          };

          // Generate PDF as Base64
          const pdfBase64 = await pdfGenerator(pdfDto);

          //  eventData.eventMode === EVENT_TYPE.FREE
          //                 ? '0'
          //                 : attendeeInfo.ticket_information.ticket_price?.toString(),

          // Construct order purchase details
          const orderPurchase: CreateOrderEmailDto = {
            name: `${attendeeInfo.personal_information.firstName} ${attendeeInfo.personal_information.lastName}`,
            event_name: eventData.eventName,
            event_address: eventData.address,
            event_date_time: eventData.startDate,
            order_number: attendeeInfo.ticket_information.order_number,
            ticket_name: attendeeInfo.ticket_information.ticket_name,
            order_date: getFormattedDate(),
            order_price:
              attendeeInfo.ticket_information.ticket_price?.toString(),
            order_discount: attendeeInfo?.discount?.toString(),
            order_subtotal: formatNumber(
              attendeeInfo.total_amount_paid?.toString(),
            ),
            order_fees: formatNumber(attendeeInfo.fees?.toString()),
            order_qty: attendeeInfo.total_purchased?.toString(),
            host_email: eventData.user?.email,
          };

          // Send email if PDF is generated
          if (pdfBase64) {
            const emailPayload: BulkEmailDto = {
              sender_name: process.env.SMTP_SENDER_NAME,
              sender_email: process.env.SMTP_SALES_SENDER_EMAIL,
              reply_to: process.env.SMTP_SALES_SENDER_EMAIL,
              receipients: [
                {
                  name: `${attendeeInfo.personal_information.firstName} ${attendeeInfo.personal_information.lastName}`,
                  email: attendeeInfo.personal_information.email,
                },
              ],
              email_subject: `Order Confirmation`,
              email_content: TicketPurchase(orderPurchase),
              email_attachment: [
                {
                  content: pdfBase64,
                  name: `${attendeeInfo.ticket_information.order_number}.pdf`,
                },
              ],
            };

            // Send the email
            await this.emailService.sendBulkEmail(emailPayload);
          }
        });

        // Execute all email promises concurrently
        await Promise.all(emailPromises);
      }

      return savedAttendees;
      // return savedAttendees;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async getGuestsByEventId(
    eventId: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<any> {
    console.log(eventId, 'event id');

    const eventData = await this.eventModel.findById(eventId);
    if (!eventData) {
      throw new Error('Event not found');
    }
    const skip = (page - 1) * limit;
    const query: any = { event: eventId };

    if (search) {
      query['$or'] = [
        { 'personal_information.firstName': { $regex: search, $options: 'i' } },
        { 'personal_information.lastName': { $regex: search, $options: 'i' } },
        { 'personal_information.email': { $regex: search, $options: 'i' } },
        { 'ticket_information.ticket_name': { $regex: search, $options: 'i' } },
      ];
    }

    try {
      const guests = await this.guestModel
        .find({ ...query })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec();

      const total = await this.guestModel.countDocuments({ ...query });
      const pages = Math.ceil(total / limit);

      return { guests, total, pages };
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async getGuestByUniquekey(
    event_unique_key: string,
    page: number,
    limit: number,
  ): Promise<any> {
    const skip = (page - 1) * limit;
    const eventData = await this.eventModel.findOne({
      unique_key: event_unique_key,
    });
    try {
      const guests = await this.guestModel
        .find({ event: eventData?._id })
        .sort({ createdAt: -1 })
        .select([
          'personal_information.firstName',
          'personal_information.lastName',
        ])
        .skip(skip)
        .limit(limit)
        .exec();

      const total = await this.guestModel.countDocuments({
        event: eventData?._id,
      });
      const pages = Math.ceil(total / limit);

      return { guests, total, pages };
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async getGuestsTicketInformation(
    eventUniqueKey: string,
    guestId: string,
    ticketId: string,
  ): Promise<any> {
    // CHECK IF IT'S A VALID EVENT
    const eventData: any = await this.eventModel.findOne({
      unique_key: eventUniqueKey,
    });

    if (!eventData) {
      throw new ForbiddenException('Event not found');
    }

    try {
      const guestData: any = await this.guestModel.findById(guestId);

      const ticket_information = guestData?.ticket_information?.find(
        (ticket: any) => ticket.ticket_id == ticketId,
      );

      return {
        personal_information: guestData.personal_information,
        ticket_information,
        order_number: guestData.order_number,
        total_purchased: guestData.total_purchased,
        total_checked_in_tickets: guestData.total_checked_in_tickets,
        check_in_status: guestData.check_in_status,
        order_date: guestData.order_date,
      };
    } catch (error) {
      throw new ForbiddenException(error?.message);
    }
  }

  async guestByTicketId(ticketId: string): Promise<any> {
    try {
      return await this.guestModel
        .find({ 'ticket_information.ticket_id': ticketId })
        .exec();
    } catch (e) {
      throw new ForbiddenException(e.message);
    }
  }

  async sendEmailToGuest(event_id: string, dto: BulkEmailGuestDto) {
    console.log(event_id, 'event id');
    console.log(dto, 'dto');

    const eventData = await this.eventModel.findById(event_id);
    if (!eventData) {
      throw new Error('Event not found');
    }
    const query: any = { event: event_id };

    try {
      if (dto.recipients.length > 0) {
        const recipeintEmails: { name: string; email: string }[] =
          dto.recipients.map((i) => {
            return {
              name: `${i.name}`,
              email: i.email,
            };
          });
        const recipientemailPromises = recipeintEmails.map((guest) => {
          const emailContent = guestEmail(
            guest.name,
            eventData.eventName,
            dto.message,
            dto.sender_email,
          );

          const payload: BulkEmailDto = {
            sender_name: dto.sender_name,
            sender_email: dto.sender_email,
            reply_to: dto.reply_to,
            receipients: [{ name: guest.name, email: guest.email }],
            email_subject: dto.subject,
            email_content: emailContent,
            email_attachment: dto.email_attachment
              ? dto.email_attachment?.map((attachment) => ({
                  url: attachment.url,
                  name: attachment.name,
                }))
              : [],
          };

          // Send email for each guest
          return this.emailService.sendBulkEmail(payload);
        });

        // Execute all email sends in parallel
        await Promise.all(recipientemailPromises);
      } else {
        const guests = await this.guestModel
          .find({ ...query })
          .sort({ createdAt: -1 });

        const guestEmails: { name: string; email: string }[] = guests.map(
          (i) => {
            return {
              name: `${i.personal_information.firstName} ${i.personal_information.lastName}`,
              email: i.personal_information.email,
            };
          },
        );

        // Prepare email sending promises
        const emailPromises = guestEmails.map((guest) => {
          const emailContent = guestEmail(
            guest.name,
            eventData.eventName,
            dto.message,
            dto.sender_email,
          );

          const payload: BulkEmailDto = {
            sender_name: dto.sender_name,
            sender_email: dto.sender_email,
            reply_to: dto.reply_to,
            receipients: [{ name: guest.name, email: guest.email }],
            email_subject: dto.subject,
            email_content: emailContent,
            email_attachment: dto.email_attachment
              ? dto.email_attachment?.map((attachment) => ({
                  url: attachment.url,
                  name: attachment.name,
                }))
              : [],
          };

          // Send email for each guest
          return this.emailService.sendBulkEmail(payload);
        });

        // Execute all email sends in parallel
        await Promise.all(emailPromises);
      }
    } catch (error) {
      throw new ForbiddenException(error?.message);
    }
  }
}
