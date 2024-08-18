import { Injectable } from '@nestjs/common';
import { GuestDto } from './dto/guests.dto';

@Injectable()
export class GuestsService {
  async register(dto: GuestDto): Promise<any> {
    // const newRegistration = new this.registrationModel({
    //   name,
    //   email,
    //   event,
    //   ticket,
    // });
    // return newRegistration.save();
    return { dto };
  }
}
