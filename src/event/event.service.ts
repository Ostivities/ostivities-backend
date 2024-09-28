import { ForbiddenException, Injectable } from '@nestjs/common';
import { FORBIDDEN_MESSAGE } from '@nestjs/core/guards';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/schema/auth.schema';
import { EVENT_MODE, EVENT_STATUS } from 'src/util/types';
import { EventDto, StringArrayDto, UpdateEventDto } from './dto/event.dto';
import { Events } from './schema/event.schema';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Events.name) private eventModel: Model<Events>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async createEvent(dto: EventDto): Promise<Events> {
    const { user } = dto;

    const userData = await this.userModel.findById(user);
    if (!userData) {
      throw new Error('User not found');
    }

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

  async updateEventById(
    id: string,
    userId: string,
    dto: UpdateEventDto,
  ): Promise<Events> {
    const userData = await this.userModel.findById(userId);
    if (!userData) {
      throw new Error('User not found');
    }

    const eventData = await this.eventModel.findById(id);
    if (!eventData) {
      throw new Error('Event not found');
    }

    try {
      const updatedEvent = await this.eventModel.findByIdAndUpdate(
        { _id: id },
        dto,
        { new: true, runValidators: true, upsert: true },
      );
      return updatedEvent;
    } catch (error) {
      console.log(error);
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }

  async getAllUserEventsById(
    page: number,
    limit: number,
    id: string,
  ): Promise<Events[] | any> {
    const skip = (page - 1) * limit;
    try {
      const userData = await this.userModel.findById(id);
      if (!userData) {
        throw new Error('User not found');
      }

      const events = await this.eventModel
        .find({ user: id })
        .skip(skip)
        .limit(limit)
        .exec();

      const total = await this.eventModel.countDocuments({ user: id });
      return { data: events, page, limit, total };
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

  async updateEventModeById(
    eventId: string,
    mode: EVENT_MODE,
  ): Promise<Events> {
    const dto: any = { mode };
    try {
      const updatedEvent = await this.eventModel.findOneAndUpdate(
        { _id: eventId },
        dto.mode,
        { new: true, upsert: false },
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
      return publishedEvent;
    } catch (error) {
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }

  async unpublishEventById(eventId: string): Promise<Events> {
    const dto = { mode: EVENT_MODE.PRIVATE };
    try {
      const unpublishedEvent = await this.eventModel.findOneAndUpdate(
        { _id: eventId },
        dto,
        { new: true, upsert: false },
      );
      return unpublishedEvent;
    } catch (error) {
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }

  async updateDiscoveryStatus(
    eventId: string,
    discover: boolean,
  ): Promise<Events> {
    const dto: any = { discover };
    console.log(dto.discover, 'discover');
    try {
      const addedEvent = await this.eventModel.findOneAndUpdate(
        { _id: eventId },
        { ...dto.discover },
        { new: true, upsert: false },
      );
      console.log(addedEvent);

      if (!addedEvent?.mode || addedEvent?.mode !== 'INACTIVE') {
        const updateDto = { mode: EVENT_MODE.PUBLIC };
        await this.eventModel.findOneAndUpdate({ _id: eventId }, updateDto, {
          new: true,
          upsert: false,
        });
      }

      return addedEvent;
    } catch (error) {
      console.log(error, 'error');
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }

  async addToDiscovery(eventId: string): Promise<Events> {
    const dto = { discover: true };
    try {
      const addedEvent = await this.eventModel.findOneAndUpdate(
        { _id: eventId },
        dto,
        { new: true, upsert: false },
      );
      if (addedEvent.mode !== 'INACTIVE' || !addedEvent.mode) {
        const updateDto = { mode: EVENT_MODE.PUBLIC };
        await this.eventModel.findOneAndUpdate({ _id: eventId }, updateDto, {
          new: true,
          upsert: false,
        });
      }
      return addedEvent;
    } catch (error) {
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }

  async removeFromDiscovery(eventId: string): Promise<Events> {
    const dto = { discover: false };
    try {
      const removedEvent = await this.eventModel.findOneAndUpdate(
        { _id: eventId },
        dto,
        { new: true, upsert: false },
      );
      return removedEvent;
    } catch (error) {
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }

  async discoverEvents(
    eventName?: string,
    state?: string,
    eventType?: string,
    page: number = 1,
    pageSize: number = 10,
    // eventMode?: EVENT_TYPE,
  ): Promise<Events[]> {
    const filter: any = {};
    const skip = (page - 1) * pageSize;

    if (eventName !== undefined) {
      filter.eventName = eventName;
    } else if (state !== undefined) {
      filter.state = state;
    } else {
      filter.discover = true;
    }

    try {
      const events = await this.eventModel
        .find(filter)
        .skip(skip)
        .limit(pageSize)
        .exec();
      return events;
    } catch (error) {
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }

  async deactivateEventByID(eventId: string): Promise<Events> {
    const dto = { mode: EVENT_STATUS.DEACTIVATED };
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
        { upsert: false, new: true },
      );
      return event;
    } catch (error) {
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }

  async deleteManyEventsById(ids: StringArrayDto): Promise<any> {
    try {
      const event = await this.eventModel.deleteMany(
        {
          _id: { $in: ids['ids'] },
        },
        { new: true, upsert: false },
      );
      return event;
    } catch (error) {
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }
}
