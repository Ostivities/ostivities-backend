import { ForbiddenException, Injectable } from '@nestjs/common';
import { FORBIDDEN_MESSAGE } from '@nestjs/core/guards';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/schema/auth.schema';
import { Events } from 'src/event/schema/event.schema';
import { Ticket } from 'src/ticket/schema/ticket.schema';
import { CoordinatorDto } from './dto/coordinator.dto';
import { Coordinator } from './schema/coordinator.schema';

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
    user: string,
  ): Promise<Coordinator> {
    const userData = await this.userModel.findById(user);
    if (!userData) {
      throw new Error('User not found');
    }

    const eventData = await this.eventModel.findById(eventId);
    if (!eventData) {
      throw new Error('Event not found');
    }

    try {
      const createdStaff = new this.coordinatorModel({
        ...dto,
        event: eventData?._id,
        user: userData?._id,
      });
      const newStaff = await createdStaff.save();
      return newStaff;
    } catch (error) {
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }

  async getCoordinatorById(id: string, eventId: string): Promise<Coordinator> {
    const eventData = await this.eventModel.findById(eventId);
    if (!eventData) {
      throw new Error('Event not found');
    }
    try {
      const staff = await this.coordinatorModel.findById({ _id: id }).lean();
      return staff;
    } catch (error) {}
  }

  async getCoordinatorByEventId(eventId: string): Promise<Coordinator[]> {
    const eventData = await this.eventModel.findById(eventId);
    if (!eventData) {
      throw new Error('Event not found');
    }
    try {
      const staffs = await this.coordinatorModel
        .find({ event: eventId })
        .populate('event');
      return staffs;
    } catch (error) {
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }
}
