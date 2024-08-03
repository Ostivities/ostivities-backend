import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';

@Injectable()
export class FileUploadService {
  constructor() {
    v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }
  async uploadFile(
    file: any,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    if (!file || !file.path) {
      throw new Error('File path is required');
    }
    return new Promise((resolve, reject) => {
      v2.uploader.upload(
        file?.path,
        { folder: 'ostivities_events' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
    });
    // if (!file || !file.path) {
    //   throw new Error('File path is required');
    // }
    // try {
    //   const result = await v2.uploader.upload(file, {
    //     folder: 'ostivities_events',
    //   });
    //   return result;
    // } catch (error) {
    //   throw error;
    // }
  }
}
