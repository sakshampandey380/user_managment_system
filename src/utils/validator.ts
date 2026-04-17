import { AppError } from "../middleware/error.middleware";
import { LoginInput, RegisterUserInput } from "../types";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

const isNonEmptyString = (value: unknown): value is string => {
  return typeof value === "string" && value.trim().length > 0;
};

const isValidDate = (value: string): boolean => {
  if (!dateRegex.test(value)) {
    return false;
  }

  const [yearText, monthText, dayText] = value.split("-");
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const parsed = new Date(Date.UTC(year, month - 1, day));

  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
};

export const validateRegisterInput = (body: unknown): RegisterUserInput => {
  if (!body || typeof body !== "object") {
    throw new AppError(400, "Request body is required");
  }

  const input = body as Record<string, unknown>;

  if (!isNonEmptyString(input.full_name)) {
    throw new AppError(400, "full_name is required");
  }

  if (!isNonEmptyString(input.date_of_birth)) {
    throw new AppError(400, "date_of_birth is required");
  }

  if (!isValidDate(input.date_of_birth.trim())) {
    throw new AppError(400, "date_of_birth must be a valid date in YYYY-MM-DD format");
  }

  if (!isNonEmptyString(input.email)) {
    throw new AppError(400, "email is required");
  }

  const email = input.email.trim();

  if (!emailRegex.test(email)) {
    throw new AppError(400, "email must be a valid email address");
  }

  if (!isNonEmptyString(input.password)) {
    throw new AppError(400, "password is required");
  }

  const password = input.password.trim();

  if (password.length < 6) {
    throw new AppError(400, "password must be at least 6 characters long");
  }

  return {
    full_name: input.full_name.trim(),
    date_of_birth: input.date_of_birth.trim(),
    email,
    password
  };
};

export const validateLoginInput = (body: unknown): LoginInput => {
  if (!body || typeof body !== "object") {
    throw new AppError(400, "Request body is required");
  }

  const input = body as Record<string, unknown>;

  if (!isNonEmptyString(input.email)) {
    throw new AppError(400, "email is required");
  }

  const email = input.email.trim();

  if (!emailRegex.test(email)) {
    throw new AppError(400, "email must be a valid email address");
  }

  if (!isNonEmptyString(input.password)) {
    throw new AppError(400, "password is required");
  }

  return {
    email,
    password: input.password.trim()
  };
};

export const parseUserIdParam = (id: string): number => {
  const userId = Number(id);

  if (!Number.isInteger(userId) || userId <= 0) {
    throw new AppError(400, "id must be a valid positive number");
  }

  return userId;
};
