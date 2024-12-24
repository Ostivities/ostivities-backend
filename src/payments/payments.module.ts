import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { DatabaseModule } from '../database/database.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Events, EventSchema } from '../event/schema/event.schema';
import { User, UserSchema } from '../auth/schema/auth.schema';
import { HttpModule } from '@nestjs/axios';
import { Payments, PaymentsSchema } from './schema/payments.schema';
import { paymentsProviders } from './payments.providers';

@Module({
  providers: [PaymentsService, ...paymentsProviders],
  controllers: [PaymentsController],
  imports: [
    HttpModule,
    DatabaseModule,
    MongooseModule.forFeature([
      { name: Events.name, schema: EventSchema },
      { name: User.name, schema: UserSchema },
      { name: Payments.name, schema: PaymentsSchema },
    ]),
  ],
})
export class PaymentsModule {}
