import { Injectable } from '@nestjs/common';

@Injectable()
export class GuestsService {
  async register(
    name: string,
    email: string,
    event: Event,
    ticket: any,
  ): Promise<any> {
    // const newRegistration = new this.registrationModel({
    //   name,
    //   email,
    //   event,
    //   ticket,
    // });
    // return newRegistration.save();
    return { name, email, event, ticket };
  }
}
