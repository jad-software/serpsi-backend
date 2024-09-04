require('dotenv').config();
import { SetMetadata } from '@nestjs/common';
export const TEST_INTEGRATION = process.env.TEST_INTEGRATION ?? false;

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const data_providers = {
  ROLE_REPOSITORY: 'ROLE_REPOSITORY',
  DATA_SOURCE: 'DATA_SOURCE',
  USER_REPOSITORY: 'USER_REPOSITORY',
  PATIENT_REPOSITORY: 'PATIENT_REPOSITORY',
  MEDICINE_REPOSITORY: 'MEDICINE_REPOSITORY',
  SCHOOL_REPOSITORY: 'SCHOOL_REPOSITORY',
  COMORBIDITY_REPOSITORY: 'COMORBIDITY_REPOSITORY',
};
export const POSTGRES_URL = process.env.POSTGRES_URL;
export const TEST_POSTGRES_URL = process.env.TEST_POSTGRES_URL;
export const jwt_constants = {
  JWT_SECRET: process.env.JWT_SECRET,
};

export const bcrypt_salt = 10;

export const email = {
  REGEX: '^[a-zA-Z0-9._%±]+@[a-zA-Z0-9.-]+[.]+[a-zA-Z]{2,}$',
};

export const CNPJ = {
  REGEX: /^[0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2}$/,
};
