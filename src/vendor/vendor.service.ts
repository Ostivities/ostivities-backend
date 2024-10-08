import { ForbiddenException, Injectable } from '@nestjs/common';
import { FORBIDDEN_MESSAGE } from '@nestjs/core/guards';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Events } from 'src/event/schema/event.schema';
import { STATUS } from 'src/util/types';
import { VendorDto } from './dto/vendor.dto';
import { Vendor } from './schema/vendor.schema';

@Injectable()
export class VendorService {
  constructor(
    @InjectModel(Vendor.name) private vendorModel: Model<Vendor>,
    @InjectModel(Events.name) private eventModel: Model<Events>,
  ) {}

  async registerVendor(dto: VendorDto, eventId: string): Promise<Vendor> {
    const eventData = await this.eventModel.findById(eventId);
    if (!eventData) {
      throw new Error('Event not found');
    }

    try {
      const createdVendor = new this.vendorModel({
        ...dto,
        event: eventData?._id,
        status: STATUS.PENDING,
      });
      console.log(createdVendor, 'created vendor');
      const savedVendor = await createdVendor.save();
      return savedVendor;
    } catch (error) {
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }

  async updateVendorStatus(
    eventId: string,
    vendorId: string,
    status: STATUS,
  ): Promise<Vendor> {
    const eventData = await this.eventModel.findById({ _id: eventId });
    if (!eventData) {
      throw new Error('Event not found');
    }

    try {
      const updatedTicket = await this.vendorModel.findOneAndUpdate(
        { _id: vendorId },
        { status: status },
        { new: true, upsert: false, runValidators: true },
      );
      return updatedTicket;
    } catch (error) {
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }

  async getAllVendorsByEventId(eventId: string): Promise<Vendor[] | any> {
    const eventData = await this.eventModel.findById({ _id: eventId });
    if (!eventData) {
      throw new Error('Event not found');
    }

    try {
      const vendors = await this.vendorModel
        .find({
          event: eventData?._id,
        })
        .populate('event')
        .exec();
      const total = await this.vendorModel.countDocuments({
        event: eventData?._id,
      });
      return { data: vendors, total };
    } catch (error) {
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }

  async getVendorById(vendorId: string): Promise<Vendor> {
    try {
      const vendor = await this.vendorModel
        .findOne({ _id: vendorId })
        .populate('event')
        .lean();

      return vendor;
    } catch (error) {
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }
}
