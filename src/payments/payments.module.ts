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
import { JwtModule } from '@nestjs/jwt';
import { Revoked, RevokedSchema } from '../auth/schema/revoked.schema';

@Module({
  providers: [PaymentsService, ...paymentsProviders],
  controllers: [PaymentsController],
  imports: [
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '24h' },
    }),
    HttpModule,
    DatabaseModule,
    MongooseModule.forFeature([
      { name: Events.name, schema: EventSchema },
      { name: User.name, schema: UserSchema },
      { name: Payments.name, schema: PaymentsSchema },
      { name: Revoked.name, schema: RevokedSchema },
    ]),
  ],
})
export class PaymentsModule {}
