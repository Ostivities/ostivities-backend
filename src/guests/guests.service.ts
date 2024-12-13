import { ForbiddenException, Injectable } from '@nestjs/common';
import { FORBIDDEN_MESSAGE } from '@nestjs/core/guards';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BulkEmailService } from 'src/bulk_email/bulk_email.service';
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

    const newRegistration = new this.guestModel({
      ...dto,
      order_number: order_number.toString(),
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

      const orderPurchase: CreateOrderEmailDto = {
        name: `${dto.personal_information.firstName} ${dto.personal_information.lastName}`,
        event_name: eventData.eventName,
        event_address: eventData.address,
        event_date_time: eventData.startDate,
        order_number: order_number.toString(),
        order_date: getFormattedDate(),
        order_discount: dto.discount.toString(),
        order_subtotal: formatNumber(dto.total_amount_paid?.toString()),
        order_fees: formatNumber(dto.fees?.toString()),
        host_email: eventData?.user?.email,
        tickets: dto.ticket_information as any,
      };

      const content: PdfDto['content'] = dto.ticket_information.flatMap(
        (ticket) =>
          Array.from({ length: ticket.quantity }, () => {
            const {
              order_number,
              order_date,
              event_date_time,
              event_address,
              event_name,
              name,
            } = orderPurchase;

            const qr_code = {
              event_id: eventData?._id,
              guest_id: savedGuest._id,
              ticket_id: ticket.ticket_id,
            };

            return {
              order_number,
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

      // const content: PdfDto['content'] = dto.ticket_information.map(
      //   (ticket) => {
      //     const {
      //       order_number,
      //       order_date,
      //       event_date_time,
      //       event_address,
      //       event_name,
      //       name,
      //     } = orderPurchase;
      //
      //     return {
      //       order_number,
      //       order_date,
      //       event_date_time,
      //       event_address,
      //       event_name,
      //       buyer_name: name,
      //       ticket_type: ticket.ticket_type,
      //       qr_code: `${process.env.OSTIVITIES_ORIGIN_URL}/check_in_portal/${savedGuest._id}/${eventData?._id}`,
      //       ostivities_logo: OSTIVITIES_LOGO,
      //       ticket_banner: TICKET_BANNER,
      //       ticket_name: ticket.ticket_name,
      //     };
      //   },
      // );

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

    // SEND EMAIL TO ATTENDEES
    if (dto?.attendees_information && dto?.attendees_information.length > 0) {
      console.log('call second');
      // SEND ATTENDEES EMAIL
      for (const attendee_information of dto.attendees_information) {
        if (attendee_information.email) {
          // REGISTER EACH ATTENDEE
          const pdfDto: PdfDto = {
            order_date: getFormattedDate(),
            buyer_name: `${attendee_information.firstName} ${attendee_information.lastName}`,
            event_address: eventData.address,
            event_date_time: eventData.startDate,
            event_name: eventData.eventName,
            order_number: order_number.toString(),
            event_id: eventData?._id,
            buyer_id: '',
            total_pages: 0,
            content: [],
          };
          const pdfBase64 = await pdfGenerator(pdfDto);
          const orderPurchase: CreateOrderEmailDto = {
            name: `${attendee_information.firstName} ${attendee_information.lastName}`,
            event_name: eventData.eventName,
            event_address: eventData.address,
            event_date_time: eventData.startDate,
            order_number: order_number.toString(),
            ticket_name: attendee_information.ticket_name,
            order_date: getFormattedDate(),
            order_price:
              eventData.eventMode === EVENT_TYPE.FREE
                ? `0`
                : attendee_information.ticket_price,
            order_discount: dto.discount?.toString(), // to be changed later
            order_subtotal: formatNumber(dto.total_amount_paid?.toString()),
            order_fees: formatNumber(dto.fees?.toString()),
            order_qty: formatNumber(dto.total_purchased?.toString()),
            host_email: eventData?.user?.email,
          };

          if (pdfBase64) {
            const payload: BulkEmailDto = {
              sender_name: process.env.SMTP_SENDER_NAME,
              sender_email: process.env.SMTP_SALES_SENDER_EMAIL,
              reply_to: process.env.SMTP_SALES_SENDER_EMAIL,
              receipients: [
                {
                  name: `${attendee_information.firstName} ${attendee_information.lastName}`,
                  email: attendee_information.email,
                },
              ],
              email_subject: `Order`,
              email_content: TicketPurchase(orderPurchase),
            };
            await this.emailService.sendBulkEmail({
              ...payload,
              email_attachment: [
                {
                  content: pdfBase64,
                  name: `${order_number}.pdf`,
                },
              ],
            });
          }
        }
      }
    }

    const tickets_metrics = await this.ticketModel
      .find({ event: eventData?._id })
      .select('ticket_sales_revenue ticket_net_sales_revenue ticket_sold')
      .exec();

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

    return savedGuest;
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
        .skip(skip)
        .limit(limit)
        .exec();

      const total = await this.guestModel.countDocuments({ ...query });
      const pages = Math.ceil(total / limit);

      return { guests, total, pages };
    } catch (error) {
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
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

      const data = {
        personal_information: guestData.personal_information,
        ticket_information,
        order_number: guestData.order_number,
        total_purchased: guestData.total_purchased,
        total_checked_in_tickets: guestData.total_checked_in_tickets,
        check_in_status: guestData.check_in_status,
        order_date: guestData.order_date,
      };
      return data;
    } catch (error) {
      throw new ForbiddenException(error?.message);
    }
  }

  async guestByTicketId(ticketId: string): Promise<any> {
    try {
      const guestData: any = await this.guestModel
        .find({ 'ticket_information.ticket_id': ticketId })
        .exec();
      return guestData;
    } catch (e) {
      throw new ForbiddenException(e.message);
    }
  }
}
