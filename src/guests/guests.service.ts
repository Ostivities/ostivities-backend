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
import { generateOrderNumber, getFormattedDate } from 'src/util/helper';
import { EVENT_TYPE } from 'src/util/types';
import { GuestDto } from './dto/guests.dto';
import { Guests } from './schema/guests.schema';

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
        const ticket_available =
          newTicketQty === 0 ? 0 : ticket.ticketQty - newTicketSold;

        total_sales_revenue +=
          eventData.total_sales_revenue + dto.total_amount_paid;

        if (ticket.ticketQty - ticket.ticket_sold === 0) {
          ticket.ticket_available = 0;
        } else {
          ticket.ticket_available += ticket.ticketQty - ticket.ticket_sold;
        }
        const updatedTicket = await this.ticketModel.findOneAndUpdate(
          { _id: ticket_information.ticket_id },
          {
            $set: {
              // ticketQty: newTicketQty,
              ticket_sold: newTicketSold,
              ticket_available: newTicketQty,
            },
          },
          { new: true },
        );

        const updated_event = await this.eventModel.findOneAndUpdate(
          { _id: eventData?._id },
          {
            $set: {
              total_ticket_sold: newTicketSold,
              total_sales_revenue: total_sales_revenue,
            },
          },
          { new: true },
        );
        console.log(
          {
            newTicketQty,
            newTicketSold,
            ticket_available,
            updatedTicket,
            updated_event,
            total_sales_revenue,
          },
          'new values',
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
    if (dto.ticket_information.length > 0 && dto.personal_information) {
      const orderPurchase: CreateOrderEmailDto = {
        name: `${dto.personal_information.firstName} ${dto.personal_information.lastName}`,
        event_name: eventData.eventName,
        event_address: eventData.address,
        event_date_time: eventData.startDate,
        order_number: order_number.toString(),
        order_date: getFormattedDate(),
        order_discount: `0`, // to be changed later
        order_subtotal: dto.total_amount_paid?.toString(),
        order_fees: `0`,
        host_email: eventData?.user?.email,
        tickets: dto.ticket_information as any,
      };

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
        email_attachment: [],
      });
    }
    // SEND EMAIL TO ATTENDEES
    if (dto.attendees_information.length > 0) {
      // SEND ATTENDEES EMAIL
      for (const attendee_information of dto.attendees_information) {
        if (attendee_information.email) {
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
            order_subtotal: dto.total_amount_paid?.toString(),
            order_fees: `0`,
            order_qty: dto.total_purchased?.toString(),
            host_email: eventData?.user?.email,
          };
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
            email_attachment: [],
          };
          await this.emailService.sendBulkEmail(payload);
        }
      }
    }

    return savedGuest;
  }

  async getGuestsByEventId(eventId: string): Promise<Guests[]> {
    const eventData = await this.eventModel.findById(eventId);
    if (!eventData) {
      throw new Error('Event not found');
    }
    try {
      const event = await this.guestModel
        .find({ event: eventId })
        .populate('ticket');
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
