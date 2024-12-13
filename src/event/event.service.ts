import { ForbiddenException, Injectable } from '@nestjs/common';
import { FORBIDDEN_MESSAGE } from '@nestjs/core/guards';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from 'src/auth/schema/auth.schema';
import {
  ACCOUNT_TYPE,
  EVENT_MODE,
  EVENT_MODES,
  STAFF_ROLE,
} from 'src/util/types';
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
import { CheckIn } from '../check_in/schema/check_in.schema';
import { CoordinatorDto } from '../coordinators/dto/coordinator.dto';
import { Coordinator } from '../coordinators/schema/coordinator.schema';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Events.name) private eventModel: Model<Events>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Ticket.name) private ticketModel: Model<Ticket>,
    @InjectModel(CheckIn.name) private checkIntModel: Model<CheckIn>,
    @InjectModel(Coordinator.name) private coordinatorModel: Model<Coordinator>,
  ) {}

  async createEvent(dto: EventDto): Promise<Events> {
    const { user } = dto;

    const userData = await this.userModel.findById(user);
    if (!userData) {
      throw new ForbiddenException('User not found');
    }

    console.log(userData, 'userData');

    try {
      const createdEvent = new this.eventModel({
        ...dto,
        mode: EVENT_MODE.PRIVATE,
      });

      const savedEvent = await createdEvent.save();

      if (savedEvent) {
        //   ADD OWNER AS COORDINATOR
        const payload: CoordinatorDto = {
          staff_email: userData?.email,
          staff_role: STAFF_ROLE.AGENT,
          password: userData?.hash,
          staff_phone_number: userData?.phone_number,
          staff_name:
            userData?.accountType === ACCOUNT_TYPE.PERSONAL
              ? `${userData?.firstName} ${userData?.lastName}`
              : `${userData?.businessName}`,
        };
        const createdStaff = new this.coordinatorModel({
          ...payload,
          event: savedEvent?._id,
          user: userData?._id,
        });
        await createdStaff.save();
      }

      return savedEvent;
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

    console.log(id, 'olop');

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
      throw new ForbiddenException(error.message);
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
  ): Promise<any> {
    const filter: any = { discover: true };
    const skip = (page - 1) * pageSize;

    if (eventName) {
      filter['$or'] = [{ eventName: { $regex: eventName, $options: 'i' } }];
    }
    if (state) {
      filter['$or'] = [{ state: { $regex: state, $options: 'i' } }];
    }
    if (eventCat) {
      filter['$or'] = [{ eventType: { $regex: eventCat, $options: 'i' } }];
    }

    try {
      const events = await this.eventModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .exec();

      const total = await this.eventModel.countDocuments({ ...filter });
      const pages = Math.ceil(total / pageSize);

      return { events, total, pages };
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

  async getEventsCheckInSummary(
    page: number,
    limit: number,
    eventId: string,
    search?: any,
  ): Promise<Events[] | any> {
    const skip = (page - 1) * limit;

    const query: any = { event: eventId };

    if (search) {
      query['$or'] = [
        { 'personal_information.firstName': { $regex: search, $options: 'i' } },
        { 'personal_information.lastName': { $regex: search, $options: 'i' } },
        { 'personal_information.email': { $regex: search, $options: 'i' } },
        { 'ticket_information.ticket_name': { $regex: search, $options: 'i' } },
        { check_in_by: { $regex: search, $options: 'i' } },
        { check_in_date_time: { $regex: search, $options: 'i' } },
      ];
    }

    try {
      const check_in_summary = await this.checkIntModel
        .find({ ...query })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec();

      const total = await this.checkIntModel.countDocuments({ ...query });
      return { check_in_summary, page, limit, total };
    } catch (error) {
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }
}
