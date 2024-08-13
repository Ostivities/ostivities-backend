import {
  Controller,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileUploadService } from './file-upload.service';

@Controller('image_upload')
@ApiTags('Image Upload Service')
export class FileUploadController {
  constructor(private fileUploadService: FileUploadService) {}

  @Post('to_cloudinary')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'image upload',
  })
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<any> {
    try {
      const data = await this.fileUploadService.uploadFile(file);
      console.log(data, 'data from file');
      return {
        statusCode: HttpStatus.OK,
        data: data,
        message: 'file uploaded successfully',
      };
    } catch (error) {
      return error;
    }
  }
}
