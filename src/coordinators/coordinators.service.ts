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
import { EmailService } from '../email/email.service';
import { VerifyAccountTemplate } from '../templates/verifyAcoount';
import { TicketAgent } from '../templates/ticketAgent';

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
    user: any,
  ): Promise<Coordinator> {
    console.log(user, 'user');
    const eventData = await this.eventModel.findById(eventId);

    if (!eventData) {
      throw new ForbiddenException('Event not found');
    }

    let payload: any = { ...dto, event: eventData?._id, user: user?._id };

    if (dto.staff_role === STAFF_ROLE.AGENT) {
      const hash = await argon.hash(dto.password);
      payload = { ...payload, password: hash, password_text: dto.password };
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

      if (newStaff && STAFF_ROLE.AGENT) {
        //   SEND EMAIL TO IICKET AGENT
        await EmailService({
          subject: 'Ticketing Agent Invitation!',
          name: `${staffObject.staff_name}`,
          email: `${staffObject.staff_email}`,
          htmlContent: TicketAgent(
            staffObject.staff_name,
            eventData?.eventName,
            staffObject.staff_email,
            staffObject.password_text,
            user.email as unknown as string,
          ),
        });
      }

      return staffObject;
    } catch (error) {
      throw new ForbiddenException(error?.message);
    }
  }

  async getCoordinatorById(id: string): Promise<Coordinator> {
    try {
      return await this.coordinatorModel.findOne({ _id: id }).lean();
    } catch (error) {
      throw new ForbiddenException(error?.message);
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
      throw new ForbiddenException(error?.message);
    }
  }

  async deleteCoordinatorById(id: string): Promise<any> {
    try {
      return await this.coordinatorModel.findByIdAndDelete({
        _id: id,
      });
    } catch (error) {
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }
}
