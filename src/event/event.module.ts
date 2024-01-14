import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/auth/schema/auth.schema';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { DatabaseModule } from 'src/database/database.module';
import { EventController } from './event.controller';
import { eventProviders } from './event.providers';
import { EventService } from './event.service';
import { EventSchema, Events } from './schema/event.schema';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '24h' },
    }),
    MongooseModule.forFeature([
      { name: Events.name, schema: EventSchema },
      { name: User.name, schema: UserSchema },
    ]),
    DatabaseModule,
  ],
  providers: [EventService, ...eventProviders, JwtStrategy],
  controllers: [EventController],
})
export class EventModule {}
