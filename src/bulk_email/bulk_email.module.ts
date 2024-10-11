import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/auth/schema/auth.schema';
import { DatabaseModule } from 'src/database/database.module';
import { BulkEmailController } from './bulk_email.controller';
import { BulkEmailService } from './bulk_email.service';

@Module({
  providers: [BulkEmailService],
  controllers: [BulkEmailController],
  imports: [
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '24h' },
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    DatabaseModule,
  ],
})
export class BulkEmailModule {}
