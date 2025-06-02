import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudnary-response';

const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
  uploadFile(
    file: Express.Multer.File,
    isPdf = false
  ): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: isPdf ? 'raw' : 'auto',
          format: file.originalname.split('.').at(-1),
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async deleteFile(publicId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }
  async deleteFileOtherThanImage(publicId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(
        publicId,
        { resource_type: 'raw' },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          if (result.result === 'ok') {
            return resolve();
          }
          reject(new Error(`Arquivo ${publicId} não encontrado.`));
        }
      );
    });
  }

  private extractPublicIdFromUrl(url: string): string | null {
    const regex = /\/image\/upload\/v\d+\/([^\.\/]+)(\.[^\.\/]+)?$/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  searchData(url: string): string {
    const publicId = this.extractPublicIdFromUrl(url);
    return publicId;
  }
}
