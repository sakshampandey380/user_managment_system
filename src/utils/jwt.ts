import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import { JwtPayload } from "../types";

const tokenOptions: SignOptions = {
  expiresIn: "24h"
};

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.jwtSecret, tokenOptions);
};

export const verifyToken = (token: string): JwtPayload => {
  const decoded = jwt.verify(token, env.jwtSecret);

  if (
    typeof decoded !== "object" ||
    decoded === null ||
    typeof decoded.userId !== "number" ||
    (decoded.role !== "admin" && decoded.role !== "user")
  ) {
    throw new Error("Invalid token payload");
  }

  return {
    userId: decoded.userId,
    role: decoded.role
  };
};
