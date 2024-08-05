import { ForbiddenException, Injectable } from '@nestjs/common';
import { FORBIDDEN_MESSAGE } from '@nestjs/core/guards';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/schema/auth.schema';
import { Events } from 'src/event/schema/event.schema';
import { CreateTicketDto, UpdateTicketDto } from './dto/ticket.dto';
import { Ticket } from './schema/ticket.schema';

@Injectable()
export class TicketService {
  constructor(
    @InjectModel(Ticket.name) private ticketModel: Model<Ticket>,
    @InjectModel(Events.name) private eventModel: Model<Events>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async createTicket(dto: CreateTicketDto): Promise<Ticket> {
    const { userId, eventId } = dto;
    console.log(eventId, 'eventid');

    const event = await this.eventModel.findById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    try {
      const createdTicket = new this.ticketModel({
        ...dto,
      });
      const savedTicket = await createdTicket.save();
      console.log(savedTicket, 'saved ticket');
      return savedTicket;
    } catch (error) {
      return error;
      // throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }

  async updateTicketById(
    ticketId: string,
    dto: UpdateTicketDto,
  ): Promise<Ticket> {
    const { userId, eventId } = dto;

    const event = await this.eventModel.findById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    try {
      const updatedTicket = await this.ticketModel.findOneAndUpdate(
        { _id: ticketId },
        dto,
        { new: true, upsert: false, runValidators: true },
      );
      return updatedTicket;
    } catch (error) {
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }

  async getTicketById(id: string): Promise<Ticket> {
    try {
      const ticket = await this.ticketModel.findOne({ _id: id }).lean();
      return ticket;
    } catch (error) {
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }
}
