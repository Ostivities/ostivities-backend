import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/auth/schema/auth.schema';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import {
  Coordinator,
  CoordinatorSchema,
} from 'src/coordinators/schema/coordinator.schema';
import { DatabaseModule } from 'src/database/database.module';
import {
  Discounts,
  DiscountsSchema,
} from 'src/discount/schema/discount.schema';
import { Guests, GuestSchema } from 'src/guests/schema/guests.schema';
import { Ticket, TicketSchema } from 'src/ticket/schema/ticket.schema';
import { Vendor, VendorSchema } from 'src/vendor/schema/vendor.schema';
import { EventController } from './event.controller';
import { eventProviders } from './event.providers';
import { EventService } from './event.service';
import { Events, EventSchema } from './schema/event.schema';
import { Revoked, RevokedSchema } from 'src/auth/schema/revoked.schema';
import { CheckIn, CheckInSchema } from '../check_in/schema/check_in.schema';
import { CoordinatorsService } from '../coordinators/coordinators.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '24h' },
    }),
    MongooseModule.forFeature([
      { name: Events.name, schema: EventSchema },
      { name: User.name, schema: UserSchema },
      { name: Discounts.name, schema: DiscountsSchema },
      { name: Ticket.name, schema: TicketSchema },
      { name: Guests.name, schema: GuestSchema },
      { name: Coordinator.name, schema: CoordinatorSchema },
      { name: Vendor.name, schema: VendorSchema },
      { name: Revoked.name, schema: RevokedSchema },
      { name: CheckIn.name, schema: CheckInSchema },
    ]),
    DatabaseModule,
  ],
  providers: [
    EventService,
    ...eventProviders,
    JwtStrategy,
    CoordinatorsService,
  ],
  controllers: [EventController],
})
export class EventModule {}
