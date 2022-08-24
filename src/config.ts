import dotenv from 'dotenv';
dotenv.config();

function required(key: string) {
  const value = process.env[key];
  if (value == null) {
    throw new Error(`Key ${key} is undefined`);
  }
  return value;
}

export const config = {
  host: {
    port: parseInt(required('HOST_PORT')),
  },
  db: {
    host: required('DB_HOST'),
  },
};
