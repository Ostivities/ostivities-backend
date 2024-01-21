import { ForbiddenException, Injectable } from '@nestjs/common';
import { FORBIDDEN_MESSAGE } from '@nestjs/core/guards';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EVENT_MODE } from 'src/util/types';
import { EventDto, StringArrayDto, UpdateEventDto } from './dto/event.dto';
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
      return event;
    } catch (error) {
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }

  async updateEventById(id: string, dto: UpdateEventDto): Promise<Events> {
    try {
      const updatedEvent = await this.eventModel.findOneAndUpdate(
        { _id: id },
        dto,
        { new: true },
      );

      return updatedEvent;
    } catch (error) {
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }

  async publishEventById(eventId: string): Promise<Events> {
    const dto = { mode: EVENT_MODE.PUBLIC };
    try {
      const publishedEvent = await this.eventModel.findOneAndUpdate(
        { _id: eventId },
        dto,
        { new: true, upsert: false },
      );
      console.log(publishedEvent, 'er');
      return publishedEvent;
    } catch (error) {
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }

  async changeEventStatusByID(
    eventId: string,
    status: string,
  ): Promise<Events> {
    const dto = { mode: EVENT_MODE[status] };
    try {
      const deactivatedEvent = await this.eventModel.findOneAndUpdate(
        { _id: eventId },
        dto,
        { new: true, upsert: false },
      );
      return deactivatedEvent;
    } catch (error) {
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }

  async deleteEventsById(id: string): Promise<any> {
    try {
      const event = await this.eventModel.deleteOne(
        { _id: id },
        { upsert: false },
      );
      return event;
    } catch (error) {
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }

  async deleteManyEventsById(ids: StringArrayDto): Promise<any> {
    try {
      const event = await this.eventModel.deleteMany({
        _id: { $in: ids['ids'] },
      });
      return event;
    } catch (error) {
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }
}
