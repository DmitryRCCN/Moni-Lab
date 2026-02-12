import dotenv from 'dotenv';

dotenv.config();

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export const env = {
  PORT: Number(process.env.PORT) || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  TURSO_DATABASE_URL: required('TURSO_DATABASE_URL'),
  TURSO_AUTH_TOKEN: required('TURSO_AUTH_TOKEN'),

  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '3h',
};

if (!env.JWT_SECRET) {
  throw new Error('JWT_SECRET is missing');
}