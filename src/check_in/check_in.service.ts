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
import { ACCOUNT_TYPE, CHECK_IN_STATUS, STAFF_ROLE } from '../util/types';
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
      payload = {
        ...payload,
        user_id: user._id,
        staff_email: user?.email,
        staff_name:
          user.accountType === ACCOUNT_TYPE.PERSONAL
            ? `${user.firstName} ${user.lastName}`
            : `${user.businessName}`,
      };
    }

    if (staff) {
      const eventData = await this.eventModel.findById(staff.event);
      payload = {
        ...payload,
        event_unique_key: eventData?.unique_key,
        staff_email: staff.staff_email,
        staff_name: staff.staff_name,
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
    orderNumber: string,
  ): Promise<any> {
    const eventData: any = await this.eventModel.findOne({
      _id: eventId,
    });

    if (!eventData) {
      throw new ForbiddenException('The specified event could not be found.');
    }
    try {
      const guestData: any = await this.guestModel.findOne({
        _id: guestId,
        'ticket_information.order_number': orderNumber,
      });

      if (!guestData) {
        throw new ForbiddenException('ticket / guest information not found');
      }

      const ticket_information = guestData?.ticket_information?.find(
        (ticket: any) => ticket.order_number == orderNumber,
      );

      console.log(guestData, 'guest data');

      return {
        personal_information: guestData.personal_information,
        ticket_information,
        total_purchased: guestData.total_purchased,
        total_checked_in_tickets: guestData.total_checked_in_tickets,
        check_in_status: guestData.check_in_status,
        order_date: guestData.createdAt,
        event_information: {
          event_name: eventData.eventName,
          event_appearance: eventData.eventImage,
          event_type: eventData.eventType,
        },
      };
    } catch (error) {
      throw new ForbiddenException(error?.message);
    }
  }

  async CheckInGuest(
    eventId: string,
    guestId: string,
    orderNumber: string,
    dto: CheckInDto,
  ) {
    const eventData: any = await this.eventModel.findOne({
      _id: eventId,
    });

    if (!eventData) {
      throw new ForbiddenException('The specified event could not be found.');
    }

    const guestData: any = await this.guestModel.findOne({
      _id: guestId,
      'ticket_information.order_number': orderNumber,
    });

    const ticket_information = guestData?.ticket_information?.find(
      (ticket: any) => ticket.order_number == orderNumber,
    );

    if (!guestData) {
      throw new ForbiddenException('Guest not found.');
    }

    if (guestData.total_checked_in_tickets >= guestData.total_purchased) {
      throw new ForbiddenException('This ticket has already been checked in.');
    }

    const checkInData: any = await this.checkInModel.findOne({
      _id: guestId,
      'ticket_information.order_number': orderNumber,
    });

    console.log(checkInData, 'checkInData');

    if (
      checkInData &&
      checkInData.ticket_information.order_number === orderNumber
    ) {
      throw new ForbiddenException('This ticket has already been checked in.');
    }

    try {
      // guestData.total_checked_in_tickets += 1;
      // guestData.check_in_status = CHECK_IN_STATUS.CHECKED_IN;
      const updatedGuest = await this.guestModel.findByIdAndUpdate(
        {
          _id: guestId,
        },
        {
          total_checked_in_tickets: guestData.total_checked_in_tickets + 1,
          check_in_status: CHECK_IN_STATUS.CHECKED_IN,
          guest_category: guestData.guest_category,
        },
        {
          new: true,
          runValidators: true,
          upsert: true,
        },
      );

      // console.log(updatedGuest, 'updated guest');
      const checkIn = new this.checkInModel({
        personal_information: guestData.personal_information,
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
