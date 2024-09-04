import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/auth/schema/auth.schema';
import { Revoked, RevokedSchema } from 'src/auth/schema/revoked.schema';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { DatabaseModule } from 'src/database/database.module';
import { Events, EventSchema } from 'src/event/schema/event.schema';
import { Ticket, TicketSchema } from 'src/ticket/schema/ticket.schema';
import { DiscountController } from './discount.controller';
import { discountProviders } from './discount.provider';
import { DiscountService } from './discount.service';
import { Discounts, DiscountsSchema } from './schema/discount.schema';

@Module({
  providers: [DiscountService, JwtStrategy, ...discountProviders],
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
      { name: Revoked.name, schema: RevokedSchema },
    ]),
    DatabaseModule,
  ],
})
export class DiscountModule {}
