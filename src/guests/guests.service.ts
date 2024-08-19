import { Injectable } from '@nestjs/common';
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
    } catch (error) {}
  }
}
