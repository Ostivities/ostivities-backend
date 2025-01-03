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
import {
  Coordinator,
  CoordinatorSchema,
} from '../coordinators/schema/coordinator.schema';
import { ScannerJwtStrategy } from '../auth/strategy/scanner-jwt.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [CheckInService, ...checkInProviders, ScannerJwtStrategy],
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
      { name: Coordinator.name, schema: CoordinatorSchema },
    ]),
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '24h' },
    }),
  ],
})
export class CheckInModule {}
