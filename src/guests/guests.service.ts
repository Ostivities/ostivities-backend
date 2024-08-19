import { ForbiddenException, Injectable } from '@nestjs/common';
import { FORBIDDEN_MESSAGE } from '@nestjs/core/guards';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Events } from 'src/event/schema/event.schema';
import { Ticket } from 'src/ticket/schema/ticket.schema';
import { GuestDto } from './dto/guests.dto';
import { Guests } from './schema/guests.schema';

@Injectable()
export class GuestsService {
  constructor(
    @InjectModel(Ticket.name) private ticketModel: Model<Ticket>,
    @InjectModel(Events.name) private eventModel: Model<Events>,
    @InjectModel(Guests.name) private guestModel: Model<Guests>,
  ) {}

  async register(dto: GuestDto): Promise<Guests> {
    const { event } = dto;
    const eventData = await this.eventModel.findById(event);
    if (!eventData) {
      throw new Error('Event not found');
    }
    try {
      const newRegistration = new this.guestModel({
        ...dto,
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
}
