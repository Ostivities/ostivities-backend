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
    @InjectModel(Events.name) private eventModel: Model<Events>,
    @InjectModel(Vendor.name) private vendorModel: Model<Vendor>,
  ) {}

  async registerVendor(dto: VendorDto, eventId: string): Promise<Vendor> {
    try {
      const eventData = await this.eventModel.findById(eventId);
      if (!eventData) {
        throw new Error('Event not found');
      }

      const createdVendor = new this.vendorModel({
        ...dto,
        event: eventData?._id,
        status: STATUS.PENDING,
      });
      const savedVendor = await createdVendor.save();
      return savedVendor;
    } catch (error) {
      throw new ForbiddenException(FORBIDDEN_MESSAGE);
    }
  }
}
