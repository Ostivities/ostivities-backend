import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/auth/schema/auth.schema';
import { DatabaseModule } from 'src/database/database.module';
import { Events, EventSchema } from 'src/event/schema/event.schema';
import { Ticket, TicketSchema } from 'src/ticket/schema/ticket.schema';
import { DiscountController } from './discount.controller';
import { Discount } from './discount.provider';
import { DiscountService } from './discount.service';
import { Discounts, DiscountsSchema } from './schema/discount.schema';

@Module({
  providers: [DiscountService, Discount],
  controllers: [DiscountController],
  imports: [
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '24h' },
    }),
    MongooseModule.forFeature([
      { name: Ticket.name, schema: TicketSchema },
      { name: Events.name, schema: EventSchema },
      { name: User.name, schema: UserSchema },
      { name: Discounts.name, schema: DiscountsSchema },
    ]),
    DatabaseModule,
  ],
})
export class DiscountModule {}
