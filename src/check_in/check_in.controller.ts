import {
  Controller,
  ForbiddenException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CheckInService } from './check_in.service';

@Controller('check-in')
export class CheckInController {
  constructor(private checkInService: CheckInService) {}

  @Post(':guest_id')
  async guestCheckIn(guestId: string) {
    try {
      const data = await this.checkInService.guestCheckIn(guestId);
      return {
        statusCode: HttpStatus.OK,
        data: data,
        message: 'Guest(s) checked in successfully',
      };
    } catch (e) {
      throw new ForbiddenException(e.message);
    }
  }
}
