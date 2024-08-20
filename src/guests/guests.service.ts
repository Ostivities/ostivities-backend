import { ForbiddenException, Injectable } from '@nestjs/common';
import { FORBIDDEN_MESSAGE } from '@nestjs/core/guards';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
  ) {}

  async register(dto: GuestDto, eventId: string): Promise<Guests> {
    const eventData = await this.eventModel.findById(eventId);
    if (!eventData) {
      throw new Error('Event not found');
    }

    const ticket = await this.ticketModel.findById({ _id: dto.ticket });
    if (!ticket) {
      throw new Error('ticket not found');
    }

    if (dto.disocuntCode) {
      const discount = await this.discountModel
        .findOne({ discountCode: dto.disocuntCode })
        .lean();
      if (!discount.discountCode) {
        throw new Error('Discount code not found');
      }
    }

    try {
      const newRegistration = new this.guestModel({
        ...dto,
        orderNo: generateOrderNumber(),
        event: eventData?._id,
      });
      const savedGuest = await newRegistration.save();
      return savedGuest;
    } catch (error) {
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
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

  async getGuestsByTicketId(ticketId: string): Promise<Guests[]> {
    const ticketData = await this.ticketModel.findById(ticketId);
    if (!ticketData) {
      throw new Error('Ticket not found');
    }
    try {
      const event = await this.guestModel
        .find({ ticket: ticketId })
        .populate('event');
      return event;
    } catch (error) {
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }
}
