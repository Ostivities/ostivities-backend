import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/auth/schema/auth.schema';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { DatabaseModule } from 'src/database/database.module';
import { EventSchema, Events } from 'src/event/schema/event.schema';
import { Ticket, TicketSchema } from './schema/ticket.schema';
import { TicketController } from './ticket.controller';
import { ticketProviders } from './ticket.provider';
import { TicketService } from './ticket.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '24h' },
    }),
    MongooseModule.forFeature([
      { name: Ticket.name, schema: TicketSchema },
      { name: Events.name, schema: EventSchema },
      { name: User.name, schema: UserSchema },
    ]),
    DatabaseModule,
  ],
  providers: [TicketService, ...ticketProviders, JwtStrategy],
  controllers: [TicketController],
})
export class TicketModule {}
