import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from 'src/database/database.module';
import { EventSchema, Events } from 'src/event/schema/event.schema';
import { AuthController } from './auth.controller';
import { authProviders } from './auth.providers';
import { AuthService } from './auth.service';
import { User, UserSchema } from './schema/auth.schema';
import {
  ForgotPasswordModel,
  ForgotPasswordSchema,
} from './schema/forgotpassword.schema';
import { JwtStrategy } from './strategy/jwt.strategy';

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
    ]),
    DatabaseModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, ...authProviders, JwtStrategy],
})
export class AuthModule {}
