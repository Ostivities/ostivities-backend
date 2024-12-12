import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Guests } from '../guests/schema/guests.schema';
import { Model } from 'mongoose';
import { CheckIn } from './schema/check_in.schema';
import { LoginUserDto } from '../auth/dto/auth.dto';
import { User } from '../auth/schema/auth.schema';
import { Coordinator } from '../coordinators/schema/coordinator.schema';
import { CHECK_IN_STATUS, STAFF_ROLE } from '../util/types';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Events } from '../event/schema/event.schema';
import { CheckInDto } from './dto/check_in.dto';

@Injectable()
export class CheckInService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectModel(Guests.name) private guestModel: Model<Guests>,
    @InjectModel(CheckIn.name) private checkInModel: Model<CheckIn>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Coordinator.name) private coordinatorModel: Model<Coordinator>,
    @InjectModel(Events.name) private eventModel: Model<Events>,
  ) {}
  async checkInLogin(dto: LoginUserDto): Promise<any> {
    console.log(dto, 'dto');
    const user = await this.userModel.findOne({
      email: dto.email,
    });
    console.log(user, 'lop');

    const staff = await this.coordinatorModel.findOne({
      staff_email: dto.email,
    });

    if (!user && !staff) {
      throw new ConflictException(
        'The specified user or coordinator could not be found.',
      );
    }

    if (staff && staff.staff_role !== STAFF_ROLE.AGENT) {
      throw new UnauthorizedException(
        `This user or coordinator does not have the required permissions. Please contact the event owner for assistance.`,
      );
    }

    if (user) {
      const pwdMatch = await argon.verify(user.hash, dto.password);
      if (!pwdMatch) {
        throw new BadRequestException('The provided password is incorrect.');
      }
    }

    if (staff && staff.staff_role === STAFF_ROLE.AGENT) {
      const pwdMatch = await argon.verify(staff.password, dto.password);
      if (!pwdMatch) {
        throw new BadRequestException('The provided password is incorrect.');
      }
    }

    let payload: any = {};

    if (user) {
      payload = { ...payload, user_id: user._id, user };
    }

    if (staff) {
      const user = await this.userModel.findOne({
        _id: staff.user,
      });
      payload = {
        ...payload,
        user_id: staff.user,
        event_id: staff.event,
        user,
        staff,
      };
    }

    try {
      const secret = this.configService.get('JWT_SECRET');
      const token = await this.jwtService.signAsync(payload, {
        expiresIn: '24h',
        secret: secret,
      });
      return { accessToken: token };
    } catch (e) {
      throw new ForbiddenException(e.message);
    }
  }

  async getGuestsTicketInformation(
    eventId: string,
    guestId: string,
    ticketId: string,
  ): Promise<any> {
    const eventData: any = await this.eventModel.findOne({
      _id: eventId,
    });

    if (!eventData) {
      throw new ForbiddenException('The specified event could not be found.');
    }
    try {
      const guestData: any = await this.guestModel.findById(guestId);

      const ticket_information = guestData?.ticket_information?.find(
        (ticket: any) => ticket.ticket_id == ticketId,
      );
      const ticket_data = {
        personal_information: guestData.personal_information,
        ticket_information,
        order_number: guestData.order_number,
        total_purchased: guestData.total_purchased,
        total_checked_in_tickets: guestData.total_checked_in_tickets,
        check_in_status: guestData.check_in_status,
        order_date: guestData.order_date,
      };
      return ticket_data;
    } catch (error) {
      throw new ForbiddenException(error?.message);
    }
  }

  async CheckInGuest(
    eventId: string,
    guestId: string,
    ticketId: string,
    dto: CheckInDto,
  ) {
    const eventData: any = await this.eventModel.findOne({
      _id: eventId,
    });

    if (!eventData) {
      throw new ForbiddenException('The specified event could not be found.');
    }

    const guest: any = await this.guestModel.findById(guestId);

    const ticket_information = guest?.ticket_information?.find(
      (ticket: any) => ticket.ticket_id == ticketId,
    );

    if (!guest) {
      throw new ForbiddenException('Guest not be found.');
    }

    if (guest.total_checked_in_tickets >= guest.total_purchased) {
      throw new BadRequestException('All tickets have already been checked in');
    }

    try {
      guest.total_checked_in_tickets += 1;
      guest.check_in_status = CHECK_IN_STATUS.CHECKED_IN;
      const updatedGuest = await guest.save();

      const checkIn = new this.checkInModel({
        personal_information: guest.personal_information,
        ticket_information: ticket_information,
        event: eventData?._id,
        check_in_by: dto.check_in_by,
        check_in_date_time: dto.check_in_date,
      }).save();

      if (updatedGuest && checkIn) {
        return {
          message: 'Guest checked in successfully',
        };
      }
    } catch (error) {
      throw new ForbiddenException(error?.message);
    }
  }
}
