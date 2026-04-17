import { NextFunction, Request, RequestHandler, Response } from "express";

interface RequestParsingError extends SyntaxError {
  status?: number;
  body?: unknown;
}

export class AppError extends Error {
  public readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";
  }
}

export const asyncHandler = (
  handler: (req: Request, res: Response, next: NextFunction) => Promise<void>
): RequestHandler => {
  return (req, res, next) => {
    void handler(req, res, next).catch(next);
  };
};

export const notFoundHandler: RequestHandler = (_req, _res, next) => {
  next(new AppError(404, "Route not found"));
};

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const parsingError = err as RequestParsingError;

  if (parsingError instanceof SyntaxError && parsingError.status === 400 && "body" in parsingError) {
    res.status(400).json({
      error: true,
      message: "Invalid JSON body"
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: true,
      message: err.message
    });
    return;
  }

  res.status(500).json({
    error: true,
    message: "Unexpected server error"
  });
};
