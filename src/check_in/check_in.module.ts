import { Module } from '@nestjs/common';
import { CheckInService } from './check_in.service';
import { CheckInController } from './check_in.controller';
import { DatabaseModule } from '../database/database.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Events, EventSchema } from '../event/schema/event.schema';
import { User, UserSchema } from '../auth/schema/auth.schema';
import { Discounts, DiscountsSchema } from '../discount/schema/discount.schema';
import { Ticket, TicketSchema } from '../ticket/schema/ticket.schema';
import { Guests, GuestSchema } from '../guests/schema/guests.schema';
import { Revoked, RevokedSchema } from '../auth/schema/revoked.schema';
import { CheckIn, CheckInSchema } from './schema/check_in.schema';
import { checkInProviders } from './check_in.provider';

@Module({
  providers: [CheckInService, ...checkInProviders],
  controllers: [CheckInController],
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      { name: Events.name, schema: EventSchema },
      { name: User.name, schema: UserSchema },
      { name: Discounts.name, schema: DiscountsSchema },
      { name: Ticket.name, schema: TicketSchema },
      { name: Guests.name, schema: GuestSchema },
      { name: Revoked.name, schema: RevokedSchema },
      { name: CheckIn.name, schema: CheckInSchema },
    ]),
  ],
})
export class CheckInModule {}
