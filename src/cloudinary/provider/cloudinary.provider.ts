import { v2 as cloudinary } from 'cloudinary'
import { CLOUDNARY_KEYS } from 'src/constants';
export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    return cloudinary.config({
      cloud_name: CLOUDNARY_KEYS.CLOUDINARUY_NAME,
      api_key: CLOUDNARY_KEYS.CLOUDINARY_API_KEY,
      api_secret: CLOUDNARY_KEYS.CLOUDINARY_API_SECRET
    });
  }
}
