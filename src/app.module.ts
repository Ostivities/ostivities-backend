import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { EventModule } from './event/event.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { SessionModule } from './session/session.module';
import { TicketModule } from './ticket/ticket.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
