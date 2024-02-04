import { ForbiddenException, Injectable } from '@nestjs/common';
import { FORBIDDEN_MESSAGE } from '@nestjs/core/guards';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTicketDto, UpdateTicketDto } from './dto/ticket.dto';
import { Ticket } from './schema/ticket.schema';

@Injectable()
export class TicketService {
  constructor(@InjectModel(Ticket.name) private ticketModel: Model<Ticket>) {}

  async createTicket(dto: CreateTicketDto): Promise<Ticket> {
    try {
      const createdTicket = new this.ticketModel({
        ...dto,
      });
      const savedTicket = await createdTicket.save();
      return savedTicket;
    } catch (error) {
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }

  async updateTicketById(
    ticketId: string,
    dto: UpdateTicketDto,
  ): Promise<Ticket> {
    try {
      const updatedTicket = await this.ticketModel.findOneAndUpdate(
        { _id: ticketId },
        dto,
        { new: true, upsert: false },
      );
      return updatedTicket;
    } catch (error) {
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }
}
