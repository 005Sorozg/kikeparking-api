import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AppException } from "../exceptions/app.exception";
import { AppErrors } from "../exceptions/errors/app.error";

interface TokenPayload {
  sub: number;
  role: string;
}

// Exige un token válido. Si no viene, o está mal, corta la petición con un 401.
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    const error = AppErrors.AUTH_TOKEN_MISSING;
    throw new AppException(error.code, error.message, error.statusCode);
  }

  const token = header.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, env.jwtSecret) as unknown as TokenPayload;

    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    const error = AppErrors.AUTH_TOKEN_INVALID;
    throw new AppException(error.code, error.message, error.statusCode);
  }
}