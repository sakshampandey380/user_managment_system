import { AppError } from "../middleware/error.middleware";
import {
  blockUserById,
  createUser,
  findUserByEmail,
  findUserById,
  getAllUsers,
  toSafeUser
} from "../models/user.model";
import { LoginInput, RegisterUserInput, SafeUser, UserRole } from "../types";
import { hashPassword, comparePassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";

interface LoginResponse {
  token: string;
  user: {
    id: number;
    full_name: string;
    email: string;
    role: UserRole;
  };
}

export const registerUser = async (
  input: RegisterUserInput
): Promise<void> => {
  const existingUser = await findUserByEmail(input.email);

  if (existingUser) {
    throw new AppError(400, "Email already exists");
  }

  const hashedPassword = await hashPassword(input.password);
  await createUser(input, hashedPassword);
};

export const loginUser = async (input: LoginInput): Promise<LoginResponse> => {
  const user = await findUserByEmail(input.email);

  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (!user.is_active) {
    throw new AppError(403, "Account is blocked");
  }

  const isPasswordValid = await comparePassword(input.password, user.password);

  if (!isPasswordValid) {
    throw new AppError(401, "Invalid password");
  }

  const token = generateToken({
    userId: user.id,
    role: user.role
  });

  return {
    token,
    user: {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role
    }
  };
};

export const getUserByIdForRequester = async (
  targetUserId: number,
  requesterId: number,
  requesterRole: UserRole
): Promise<SafeUser> => {
  if (requesterRole !== "admin" && requesterId !== targetUserId) {
    throw new AppError(403, "Forbidden");
  }

  const user = await findUserById(targetUserId);

  if (!user) {
    throw new AppError(404, "User not found");
  }

  return toSafeUser(user);
};

export const getUsersForAdmin = async (
  requesterRole: UserRole
): Promise<SafeUser[]> => {
  if (requesterRole !== "admin") {
    throw new AppError(403, "Forbidden");
  }

  const users = await getAllUsers();
  return users.map(toSafeUser);
};

export const blockUserForRequester = async (
  targetUserId: number,
  requesterId: number,
  requesterRole: UserRole
): Promise<void> => {
  if (requesterRole !== "admin" && requesterId !== targetUserId) {
    throw new AppError(403, "Forbidden");
  }

  const user = await findUserById(targetUserId);

  if (!user) {
    throw new AppError(404, "User not found");
  }

  await blockUserById(targetUserId);
};
