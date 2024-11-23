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
import { EVENT_TYPE } from 'src/util/types';
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

        if (ticket.ticketQty < ticket_information.quantity) {
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
        const newTicketQty = ticket.ticketQty - ticket_information.quantity;
        const newTicketSold = ticket.ticket_sold + ticket_information.quantity;

        // const ticket_available =
        //   newTicketQty === 0 ? 0 : ticket.ticketQty - newTicketSold;

        total_sales_revenue +=
          eventData.total_sales_revenue + dto.total_amount_paid;

        ticket_sales_revenue +=
          dto.fees +
          ticket_information.total_amount +
          ticket.ticket_sales_revenue;

        ticket_net_sales_revenue +=
          ticket_sales_revenue - dto.fees + ticket.ticket_net_sales_revenue;

        if (ticket.ticketQty - ticket.ticket_sold === 0) {
          ticket.ticket_available = 0;
        } else {
          ticket.ticket_available += ticket.ticketQty - ticket.ticket_sold;
        }
        await this.ticketModel.findOneAndUpdate(
          { _id: ticket_information.ticket_id },
          {
            $set: {
              // ticketQty: newTicketQty,
              ticket_sold: newTicketSold,
              ticket_available: newTicketQty,
              // map fees from fees api
              fees: dto.fees,
              ticket_sales_revenue,
              ticket_net_sales_revenue,
            },
          },
          { new: true },
        );

        await this.eventModel.findOneAndUpdate(
          { _id: eventData?._id },
          {
            $set: {
              total_ticket_sold: newTicketSold,
              total_sales_revenue: total_sales_revenue,
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

            return {
              order_number,
              order_date,
              event_date_time,
              event_address,
              event_name,
              buyer_name: name,
              ticket_type: ticket.ticket_type,
              qr_code: `${process.env.OSTIVITIES_ORIGIN_URL}/check_in_portal/${savedGuest._id}/${eventData?._id}`,
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
            order_discount: `0`, // to be changed later
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

    return savedGuest;
  }

  async getGuestsByEventId(eventId: string): Promise<Guests[]> {
    console.log(eventId, 'event id');
    const eventData = await this.eventModel.findById(eventId);
    if (!eventData) {
      throw new Error('Event not found');
    }
    try {
      const event = await this.guestModel.find({ event: eventId }).exec();
      return event;
    } catch (error) {
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }

  // async getGuestsByTicketId(ticketId: string): Promise<Guests[]> {
  //   const ticketData = await this.ticketModel.findById(ticketId);
  //   if (!ticketData) {
  //     throw new Error('Ticket not found');
  //   }
  //   try {
  //     const event = await this.guestModel
  //       .find({ ticket: ticketId })
  //       .populate('event');
  //     return event;
  //   } catch (error) {
  //     throw new ForbiddenException(FORBIDDEN_MESSAGE);
  //   }
  // }
}
