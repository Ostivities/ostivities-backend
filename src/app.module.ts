import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CoordinatorsModule } from './coordinators/coordinators.module';
import { DatabaseModule } from './database/database.module';
import { DiscountModule } from './discount/discount.module';
import { EventModule } from './event/event.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { GuestsModule } from './guests/guests.module';
import { SecurityModule } from './security/security.module';
import { SessionModule } from './session/session.module';
import { SettleAccountsModule } from './settle_accounts/settle_accounts.module';
import { TicketModule } from './ticket/ticket.module';
import { VendorModule } from './vendor/vendor.module';

// sudo  mongod --dbpath=/Users/dreezy/data/db

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
    }),
    DatabaseModule,
    EventModule,
    SessionModule,
    TicketModule,
    FileUploadModule,
    MulterModule.register({ dest: './upload' }),
    SettleAccountsModule,
    SecurityModule,
    DiscountModule,
    GuestsModule,
    CoordinatorsModule,
    VendorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
