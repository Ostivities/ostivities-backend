import { ForbiddenException, Injectable } from '@nestjs/common';
import { FORBIDDEN_MESSAGE } from '@nestjs/core/guards';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventDto } from './dto/event.dto';
import { Events } from './schema/event.schema';

@Injectable()
export class EventService {
  constructor(@InjectModel(Events.name) private eventModel: Model<Events>) {}

  async createEvent(dto: EventDto): Promise<Events> {
    try {
      const createdEvent = new this.eventModel({
        ...dto,
      });
      const savedEvent = await createdEvent.save();

      return savedEvent;
    } catch (error) {
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }

  async getEvents(): Promise<Events[]> {
    try {
      const events = await this.eventModel.find().populate('user').exec();
      return events;
    } catch (error) {
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }

  async getEventsById(id: string): Promise<Events> {
    try {
      const event = await this.eventModel.findOne({ _id: id }).lean();
      console.log(event, 'event');
      return event;
    } catch (error) {
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }

  async deleteEventsById(id: string): Promise<any> {
    try {
      const event = await this.eventModel.deleteOne({ _id: id });
      return event;
    } catch (error) {
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }

  async deleteManyEventsById(ids: string[]): Promise<any> {
    try {
      const event = await this.eventModel.deleteMany({
        id: { $in: ids['ids'] },
      });
      return event;
    } catch (error) {
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }
}
