import { Response } from "express";
import { AuthenticatedRequest } from "../types";
import {
  blockUserForRequester,
  getUserByIdForRequester,
  getUsersForAdmin,
  loginUser,
  registerUser
} from "../services/user.services";
import {
  parseUserIdParam,
  validateLoginInput,
  validateRegisterInput
} from "../utils/validator";
import { AppError } from "../middleware/error.middleware";

const requireAuthenticatedUser = (req: AuthenticatedRequest) => {
  if (!req.user) {
    throw new AppError(401, "Missing, invalid, or expired token");
  }

  return req.user;
};

export const register = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const input = validateRegisterInput(req.body);
  await registerUser(input);

  res.status(201).json({
    message: "User registered successfully"
  });
};

export const login = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const input = validateLoginInput(req.body);
  const result = await loginUser(input);

  res.status(200).json(result);
};

export const getUser = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const authenticatedUser = requireAuthenticatedUser(req);
  const targetUserId = parseUserIdParam(req.params.id);
  const user = await getUserByIdForRequester(
    targetUserId,
    authenticatedUser.userId,
    authenticatedUser.role
  );

  res.status(200).json(user);
};

export const getUsers = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const authenticatedUser = requireAuthenticatedUser(req);
  const users = await getUsersForAdmin(authenticatedUser.role);

  res.status(200).json(users);
};

export const blockUser = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const authenticatedUser = requireAuthenticatedUser(req);
  const targetUserId = parseUserIdParam(req.params.id);

  await blockUserForRequester(
    targetUserId,
    authenticatedUser.userId,
    authenticatedUser.role
  );

  res.status(200).json({
    message: "User blocked successfully"
  });
};
