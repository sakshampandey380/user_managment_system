import dotenv from "dotenv";

dotenv.config();

const getRequiredEnv = (key: string): string => {
  const value = process.env[key];

  if (!value || value.trim() === "") {
    throw new Error(`${key} is required in environment variables`);
  }

  return value.trim();
};

const getOptionalEnv = (key: string): string => {
  return process.env[key] ?? "";
};

const parsePort = (key: string): number => {
  const value = Number(getRequiredEnv(key));

  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${key} must be a valid positive number`);
  }

  return value;
};

export const env = {
  port: parsePort("PORT"),
  jwtSecret: getRequiredEnv("JWT_SECRET"),
  db: {
    host: getRequiredEnv("DB_HOST"),
    port: parsePort("DB_PORT"),
    user: getRequiredEnv("DB_USER"),
    password: getOptionalEnv("DB_PASSWORD"),
    database: getRequiredEnv("DB_NAME")
  }
};
