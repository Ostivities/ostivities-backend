import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { FileUpload } from './file-upload';
import { FileUploadController } from './file-upload.controller';
import { CloudinaryProvider } from './file-upload.providers';
import { FileUploadService } from './file-upload.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [FileUploadService, FileUpload, CloudinaryProvider],
  controllers: [FileUploadController],
  exports: [CloudinaryProvider, FileUploadService],
})
export class FileUploadModule {}
