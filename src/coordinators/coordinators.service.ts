import { ForbiddenException, Injectable } from '@nestjs/common';
import { FORBIDDEN_MESSAGE } from '@nestjs/core/guards';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/schema/auth.schema';
import { Events } from 'src/event/schema/event.schema';
import { Ticket } from 'src/ticket/schema/ticket.schema';
import { CoordinatorDto } from './dto/coordinator.dto';
import { Coordinator } from './schema/coordinator.schema';
import * as argon from 'argon2';
import { STAFF_ROLE } from '../util/types';

@Injectable()
export class CoordinatorsService {
  constructor(
    @InjectModel(Ticket.name) private ticketModel: Model<Ticket>,
    @InjectModel(Events.name) private eventModel: Model<Events>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Coordinator.name) private coordinatorModel: Model<Coordinator>,
  ) {}

  async createStaff(
    dto: CoordinatorDto,
    eventId: string,
  ): Promise<Coordinator> {
    const eventData = await this.eventModel.findById(eventId);
    if (!eventData) {
      throw new Error('Event not found');
    }

    let payload: any = { ...dto, event: eventData?._id };

    if (dto.staff_role === STAFF_ROLE.AGENT) {
      const hash = await argon.hash(dto.password);
      payload = { ...payload, password: hash };
    }

    try {
      const createdStaff = new this.coordinatorModel({
        ...payload,
      });
      const newStaff = await createdStaff.save();

      const staffObject = newStaff.toObject();
      if (staffObject.password) {
        delete staffObject.password;
      }

      return staffObject;
    } catch (error) {
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }

  async getCoordinatorById(id: string): Promise<Coordinator> {
    try {
      const staff = await this.coordinatorModel.findOne({ _id: id }).lean();
      return staff;
    } catch (error) {
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }

  async getCoordinatorsByEventId(
    eventId: string,
  ): Promise<Coordinator[] | any> {
    const eventData = await this.eventModel.findById(eventId);
    if (!eventData) {
      throw new Error('Event not found');
    }
    try {
      const staffs = await this.coordinatorModel
        .find({ event: eventData?._id })
        .populate('event')
        .exec();
      const total = await this.coordinatorModel.countDocuments({
        event: eventData?._id,
      });
      return { data: staffs, total };
    } catch (error) {
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }

  async deleteCoordinatorById(id: string): Promise<any> {
    try {
      const deletedStaff = await this.coordinatorModel.findByIdAndDelete({
        _id: id,
      });
      return deletedStaff;
    } catch (error) {
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }
}
