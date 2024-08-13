import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/schema/auth.schema';
import { Events } from 'src/event/schema/event.schema';
import { Ticket } from 'src/ticket/schema/ticket.schema';
import { CreateDiscountDto } from './dto/discount.dto';
import { Discounts } from './schema/discount.schema';

@Injectable()
export class DiscountService {
  constructor(
    @InjectModel(Events.name) private eventModel: Model<Events>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Ticket.name) private ticketModel: Model<Ticket>,
    @InjectModel(Discounts.name) private discountsModel: Model<Discounts>,
  ) {}

  async createDiscount(dto: CreateDiscountDto) {
    return dto;
  }
}
