require('dotenv').config();

export const data_providers = {
    ROLE_REPOSITORY: 'ROLE_REPOSITORY',
    DATA_SOURCE: 'DATA_SOURCE',
    USER_REPOSITORY: 'USER_REPOSITORY',
}
export const POSTGRES_URL = process.env.POSTGRES_URL
export const JWT_SECRET = process.env.JWT_SECRET