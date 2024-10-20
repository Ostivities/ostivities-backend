import { ForbiddenException, Injectable } from '@nestjs/common';
import { FORBIDDEN_MESSAGE } from '@nestjs/core/guards';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BulkEmailService } from 'src/bulk_email/bulk_email.service';
import { BulkEmailDto } from 'src/bulk_email/dto/email.dto';
import { Discounts } from 'src/discount/schema/discount.schema';
import { Events } from 'src/event/schema/event.schema';
import { Ticket } from 'src/ticket/schema/ticket.schema';
import { generateOrderNumber } from 'src/util/helper';
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
    const order_number = `ORD-${generateOrderNumber()}`;
    const eventData = await this.eventModel.findById(eventId);
    if (!eventData) {
      throw new Error('Event not found');
    }

    if (dto.ticket_information.length > 0) {
      for (const ticket_information of dto.ticket_information) {
        const ticket = await this.ticketModel.findById(
          ticket_information.ticket_id,
        );
        if (!ticket) {
          throw new Error(`${ticket_information.ticket_name} not found`);
        }
        if (ticket.ticketQty < ticket_information.quantity) {
          throw new Error(
            `Not enough tickets available for ${ticket_information.ticket_name}`,
          );
        }

        if (ticket.ticketQty <= 0) {
          throw new Error(`${ticket_information.ticket_name} sold out`);
        }

        // calculate ticket quantity left
        ticket.ticketQty -= ticket_information.quantity;
        ticket.ticket_sold += ticket_information.quantity;
        if (ticket.ticketQty - ticket.ticket_sold === 0) {
          ticket.ticket_available = 0;
        } else {
          ticket.ticket_available += ticket.ticketQty - ticket.ticket_sold;
        }

        await ticket.save();
      }
    }

    const newRegistration = new this.guestModel({
      ...dto,
      order_number,
      event: eventData?._id,
    });
    const savedGuest = await newRegistration.save();
    // send email to attendees
    if (savedGuest && dto.attendees_information.length > 0) {
      for (const attendee_information of dto.attendees_information) {
        if (attendee_information.email) {
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
            email_content: `<html>
          <body>
            <h1>Thank you for registering, ${attendee_information.firstName} ${attendee_information.lastName}</h1>
            <p>Your order number is: <strong>${order_number}</strong></p>
            <p>We look forward to seeing you at the event.</p>
          </body>
        </html>`,
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
