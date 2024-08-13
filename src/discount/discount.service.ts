import { ForbiddenException, Injectable } from '@nestjs/common';
import { FORBIDDEN_MESSAGE } from '@nestjs/core/guards';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/schema/auth.schema';
import { Events } from 'src/event/schema/event.schema';
// import { Ticket } from 'src/ticket/schema/ticket.schema';
import { generateDiscountCode } from 'src/util/helper';
import { CreateDiscountDto, UpdateDiscountDto } from './dto/discount.dto';
import { Discounts } from './schema/discount.schema';

@Injectable()
export class DiscountService {
  constructor(
    @InjectModel(Events.name) private eventModel: Model<Events>,
    @InjectModel(User.name) private userModel: Model<User>,
    // @InjectModel(Ticket.name) private ticketModel: Model<Ticket>,
    @InjectModel(Discounts.name) private discountModel: Model<Discounts>,
  ) {}

  async createDiscount(dto: CreateDiscountDto): Promise<Discounts> {
    const { event, user } = dto;
    const userData = await this.userModel.findById(user);
    if (!userData) {
      throw new Error('User not found');
    }

    const eventData = await this.eventModel.findById(event);
    if (!eventData) {
      throw new Error('Event not found');
    }
    try {
      let discountCode: string;
      let existingDiscount: any;

      // CHECK IF A DISCOUNT CODE EXISTS (HANDLES POSSIBLE CODE COLLISIONS)
      do {
        discountCode = generateDiscountCode();
        existingDiscount = await this.discountModel.findOne({
          discountCode,
        });
      } while (existingDiscount);

      const discount = new this.discountModel({
        ...dto,
        event: event,
        user: userData?._id,
        discountCode,
      }).save();

      return discount;
    } catch (error) {
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }

  async updateDiscount(id: string, dto: UpdateDiscountDto): Promise<Discounts> {
    const { event, user } = dto;
    const userData = await this.userModel.findById(user);
    if (!userData) {
      throw new Error('User not found');
    }

    const eventData = await this.eventModel.findById(event);
    if (!eventData) {
      throw new Error('Event not found');
    }

    try {
      const discount = await this.discountModel.findById(id);
      if (!discount) {
        throw new Error('Discount not found');
      }
      // update only allowed fields
      if (dto.discountType) {
        discount.discountType = dto.discountType;
      }

      if (dto.startDateAndTime) {
        discount.startDateAndTime = dto.startDateAndTime;
      }

      if (dto.endDateAndTime) {
        discount.endDateAndTime = dto.endDateAndTime;
      }

      if (dto.discountType) {
        discount.discountType = dto.discountType;
      }

      if (dto.usageLimit) {
        discount.usageLimit = dto.usageLimit;
      }

      return discount.save();
    } catch (error) {
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }
}
