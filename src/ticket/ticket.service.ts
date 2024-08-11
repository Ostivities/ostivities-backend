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
    const { user, event } = dto;
    console.log(user, 'user id');
    console.log(event, 'user id');

    const eventData = await this.eventModel.findById(event);
    if (!eventData) {
      throw new Error('Event not found');
    }

    const userData = await this.userModel.findById(user);
    if (!userData) {
      throw new Error('User not found');
    }

    try {
      const createdTicket = new this.ticketModel({
        ...dto,
        event: eventData?._id,
        user: userData?._id,
      });
      const savedTicket = await createdTicket.save();
      console.log(savedTicket, 'saved ticket');
      return savedTicket;
    } catch (error) {
      return error;
    }
  }

  async updateTicketById(
    ticketId: string,
    dto: UpdateTicketDto,
  ): Promise<Ticket> {
    const { user, event } = dto;

    const eventData = await this.eventModel.findById(event);
    if (!eventData) {
      throw new Error('Event not found');
    }

    const userData = await this.userModel.findById(user);
    if (!userData) {
      throw new Error('User not found');
    }

    const ticket = await this.ticketModel.findById({ _id: ticketId }).lean();

    if (!ticket) {
      throw new Error('User not found');
    }

    try {
      const updatedTicket = await this.ticketModel.findOneAndUpdate(
        { _id: ticketId },
        { ...dto, event: eventData?._id, user: userData?._id },
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

  async getTicketsByEventId(eventId: string): Promise<Ticket[]> {
    const eventData = await this.eventModel.findById(eventId);
    if (!eventData) {
      throw new Error('Event not found');
    }
    try {
      const tickets = await this.ticketModel.find({ event: eventData?._id });
      return tickets;
    } catch (error) {
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }

  async deleteTicketById(id: string): Promise<Ticket | any> {
    const ticket = await this.ticketModel.findOne({ _id: id }).lean();
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    try {
      const deletedEvent = await this.ticketModel.findByIdAndDelete({
        _id: id,
      });
      return deletedEvent;
    } catch (error) {
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }
}
