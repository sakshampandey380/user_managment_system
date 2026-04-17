import { NextFunction, Response } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { AuthenticatedRequest } from "../types";
import { verifyToken } from "../utils/jwt";
import { AppError } from "./error.middleware";

export const authenticateToken = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next(new AppError(401, "Missing, invalid, or expired token"));
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    req.user = verifyToken(token);
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError || error instanceof JsonWebTokenError) {
      next(new AppError(401, "Missing, invalid, or expired token"));
      return;
    }

    next(new AppError(401, "Missing, invalid, or expired token"));
  }
};
