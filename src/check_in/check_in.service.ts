import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Guests } from '../guests/schema/guests.schema';
import { Model } from 'mongoose';
import { CheckIn } from './schema/check_in.schema';

@Injectable()
export class CheckInService {
  constructor(
    @InjectModel(Guests.name) private guestModel: Model<Guests>,
    @InjectModel(CheckIn.name) private checkInModel: Model<CheckIn>,
  ) {}
  async guestCheckIn(guestId: string): Promise<any> {
    try {
      console.log(guestId, 'guest id');
    } catch (e) {
      throw new ForbiddenException(e.message);
    }
  }
}
