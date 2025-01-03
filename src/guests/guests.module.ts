import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/auth/schema/auth.schema';
import { Revoked, RevokedSchema } from 'src/auth/schema/revoked.schema';
import { BulkEmailService } from 'src/bulk_email/bulk_email.service';
import { DatabaseModule } from 'src/database/database.module';
import {
  Discounts,
  DiscountsSchema,
} from 'src/discount/schema/discount.schema';
import { Events, EventSchema } from 'src/event/schema/event.schema';
import { Ticket, TicketSchema } from 'src/ticket/schema/ticket.schema';
import { GuestsController } from './guests.controller';
import { guestProviders } from './guests.provider';
import { GuestsService } from './guests.service';
import { Guests, GuestSchema } from './schema/guests.schema';

@Module({
  providers: [GuestsService, ...guestProviders, BulkEmailService],
  controllers: [GuestsController],
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      { name: Events.name, schema: EventSchema },
      { name: User.name, schema: UserSchema },
      { name: Discounts.name, schema: DiscountsSchema },
      { name: Ticket.name, schema: TicketSchema },
      { name: Guests.name, schema: GuestSchema },
      { name: Revoked.name, schema: RevokedSchema },
    ]),
  ],
})
export class GuestsModule {}
