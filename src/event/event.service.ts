import { ForbiddenException, Injectable } from '@nestjs/common';
import { FORBIDDEN_MESSAGE } from '@nestjs/core/guards';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from 'src/auth/schema/auth.schema';
import { EVENT_MODE, EVENT_MODES } from 'src/util/types';
import {
  EventDto,
  StringArrayDto,
  UpdateEventDiscoveryDto,
  UpdateEventDto,
  UpdateEventModeDto,
  UpdateEventRegistrationDto,
} from './dto/event.dto';
import { Events } from './schema/event.schema';
import { Ticket } from '../ticket/schema/ticket.schema';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Events.name) private eventModel: Model<Events>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Ticket.name) private ticketModel: Model<Ticket>,
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
        mode: EVENT_MODE.PRIVATE,
      });
      return await createdEvent.save();
    } catch (error) {
      throw new ForbiddenException(error.message);
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
      return await this.eventModel.findByIdAndUpdate({ _id: id }, dto, {
        new: true,
        runValidators: true,
        upsert: true,
      });
    } catch (error) {
      console.log(error);
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }

  async getAllUserEventsById(
    page: number,
    limit: number,
    search: any,
    id: string,
  ): Promise<Events[] | any> {
    const skip = (page - 1) * limit;

    try {
      const userData = await this.userModel.findById(id);
      if (!userData) {
        throw new ForbiddenException('User not found');
      }

      const events = await this.eventModel
        .find({ user: userData?._id })
        .or([
          { eventName: { $regex: search, $options: 'i' } },
          { eventType: { $regex: search, $options: 'i' } },
          { mode: { $regex: search, $options: 'i' } },
          // { created_at: { $regex: search, $options: 'i' } },
        ])
        .sort({ createdAt: -1 })
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
      return await this.eventModel
        .findOne({ _id: id })
        .populate({
          path: 'user',
          select: 'firstName lastName email accountType businessName',
        })
        .exec();
    } catch (error) {
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }

  async getEventsByUniqueKey(id: string): Promise<Events> {
    try {
      const event = await this.eventModel
        .findOne({ unique_key: id })
        .populate({
          path: 'user',
          select: 'firstName lastName email accountType businessName',
        })
        .exec();
      return event;
    } catch (error) {
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }

  async updateEventModeById(dto: UpdateEventModeDto): Promise<any> {
    const validIds = dto.ids.filter((id: string) => Types.ObjectId.isValid(id));

    const [eventId] = dto.ids;
    const tickets = await this.ticketModel.find({ event: eventId });

    if (!tickets || tickets.length === 0) {
      throw new ForbiddenException(
        'Event does not have ticket(s), only event with ticket(s) can be published',
      );
    }

    try {
      const updateStatus = await this.eventModel.updateMany(
        { _id: { $in: validIds } },
        {
          mode: dto.mode,
          discover: dto.mode === EVENT_MODE.PUBLIC ? true : false,
        },
        { new: true, upsert: false },
      );

      return updateStatus;
    } catch (error) {
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }

  async closeEventModeById(eventId: string): Promise<Events> {
    const dto: any = { mode: EVENT_MODE.CLOSED };
    try {
      const updatedEvent = await this.eventModel.findOneAndUpdate(
        { _id: eventId },
        dto,
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
      throw new ForbiddenException(error.message);
    }
  }

  async updateDiscoveryStatus(dto: UpdateEventDiscoveryDto): Promise<any> {
    const validIds = dto.ids.filter((id: string) => Types.ObjectId.isValid(id));
    try {
      const updateStatus = await this.eventModel.updateMany(
        { _id: { $in: validIds } },
        {
          discover: dto.discover,
          // mode: dto.discover === true ? EVENT_MODE.PUBLIC : EVENT_MODE.PRIVATE,
        },
        { new: true, upsert: false },
      );

      return updateStatus;
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
    page: number,
    pageSize: number,
    eventName?: string,
    state?: string,
    eventCat?: EVENT_MODES,

    // eventMode?: EVENT_TYPE,
  ): Promise<Events[]> {
    const filter: any = { discover: true };
    const skip = (page - 1) * pageSize;

    if (eventName !== undefined) {
      filter.eventName = eventName;
    } else if (state !== undefined) {
      filter.state = state;
    } else if (eventCat !== undefined) {
      filter.mode = eventCat;
    }

    console.log(filter, 'filter');

    try {
      const events = await this.eventModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .exec();
      return events;
    } catch (error) {
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }

  // async deactivateEventByID(eventId: string): Promise<Events> {
  //   const dto = { mode: EVENT_STATUS.DEACTIVATED };
  //   try {
  //     const deactivatedEvent = await this.eventModel.findOneAndUpdate(
  //       { _id: eventId },
  //       dto,
  //       { new: true, upsert: false },
  //     );
  //     return deactivatedEvent;
  //   } catch (error) {
  //     throw new ForbiddenException(FORBIDDEN_MESSAGE);
  //   }
  // }

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
    const validIds = ids['ids'].filter((id) => Types.ObjectId.isValid(id));

    try {
      const event = await this.eventModel.deleteMany({
        _id: { $in: validIds },
      });
      console.log(event, 'jj');
      return event;
    } catch (error) {
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }

  async updateEventRegistration(
    dto: UpdateEventRegistrationDto,
  ): Promise<Events> {
    try {
      return await this.eventModel.findOneAndUpdate(
        { _id: dto.id },
        { enable_registration: dto.enable_registration },
        { new: true, upsert: false },
      );
    } catch (error) {
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }
}
