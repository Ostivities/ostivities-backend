import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Coordinator,
  CoordinatorSchema,
} from 'src/coordinators/schema/coordinator.schema';
import { DatabaseModule } from 'src/database/database.module';
import {
  Discounts,
  DiscountsSchema,
} from 'src/discount/schema/discount.schema';
import { EventSchema, Events } from 'src/event/schema/event.schema';
import { Security, SecuritySchema } from 'src/security/schema/security.schema';
import {
  SettlementAccount,
  SettlementAccountSchema,
} from 'src/settle_accounts/schema/settlement.schema';
import { Vendor, VendorSchema } from 'src/vendor/schema/vendor.schema';
import { AuthController } from './auth.controller';
import { authProviders } from './auth.providers';
import { AuthService } from './auth.service';
import { ActivateUser, ActivateUserSchema } from './schema/activation.schema';
import { User, UserSchema } from './schema/auth.schema';
import {
  ForgotPasswordModel,
  ForgotPasswordSchema,
} from './schema/forgotpassword.schema';
import { Revoked, RevokedSchema } from './schema/revoked.schema';
import { JwtStrategy } from './strategy/jwt.strategy';
import { CheckIn, CheckInSchema } from '../check_in/schema/check_in.schema';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '24h' },
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: ForgotPasswordModel.name, schema: ForgotPasswordSchema },
      { name: Events.name, schema: EventSchema },
      { name: Security.name, schema: SecuritySchema },
      { name: SettlementAccount.name, schema: SettlementAccountSchema },
      { name: ActivateUser.name, schema: ActivateUserSchema },
      { name: Discounts.name, schema: DiscountsSchema },
      { name: Coordinator.name, schema: CoordinatorSchema },
      { name: Vendor.name, schema: VendorSchema },
      { name: Revoked.name, schema: RevokedSchema },
      { name: CheckIn.name, schema: CheckInSchema },
    ]),
    DatabaseModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, ...authProviders, JwtStrategy],
})
export class AuthModule {}
