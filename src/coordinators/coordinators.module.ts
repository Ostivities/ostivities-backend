import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/auth/schema/auth.schema';
import { Revoked, RevokedSchema } from 'src/auth/schema/revoked.schema';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { DatabaseModule } from 'src/database/database.module';
import { Events, EventSchema } from 'src/event/schema/event.schema';
import { Ticket, TicketSchema } from 'src/ticket/schema/ticket.schema';
import { CoordinatorsController } from './coordinators.controller';
import { coordinatorProviders } from './coordinators.provider';
import { CoordinatorsService } from './coordinators.service';
import { Coordinator, CoordinatorSchema } from './schema/coordinator.schema';

@Module({
  providers: [CoordinatorsService, ...coordinatorProviders, JwtStrategy],
  controllers: [CoordinatorsController],
  imports: [
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '24h' },
    }),
    DatabaseModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Events.name, schema: EventSchema },
      { name: Coordinator.name, schema: CoordinatorSchema },
      { name: Ticket.name, schema: TicketSchema },
      { name: Revoked.name, schema: RevokedSchema },
    ]),
  ],
})
export class CoordinatorsModule {}
