import { Request } from "express";

export type UserRole = "admin" | "user";

export interface User {
  id: number;
  full_name: string;
  date_of_birth: string;
  email: string;
  password: string;
  role: UserRole;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface SafeUser {
  id: number;
  full_name: string;
  date_of_birth: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    role: UserRole;
  };
}

export interface RegisterUserInput {
  full_name: string;
  date_of_birth: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface JwtPayload {
  userId: number;
  role: UserRole;
}
