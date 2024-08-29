require('dotenv').config();
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)

export const data_providers = {
  ROLE_REPOSITORY: 'ROLE_REPOSITORY',
  DATA_SOURCE: 'DATA_SOURCE',
  USER_REPOSITORY: 'USER_REPOSITORY',
};
export const POSTGRES_URL = process.env.POSTGRES_URL;

export const jwt_constants = {
  JWT_SECRET: process.env.JWT_SECRET,
};

export const bcrypt_salt = 10;