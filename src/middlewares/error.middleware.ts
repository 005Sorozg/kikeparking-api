import { Request, Response, NextFunction } from "express";
import { AppException } from "../exceptions/app.exception";
import { AppErrors } from "../exceptions/errors/app.error";
import { logger } from "../config/logger";

// Formato único de error de toda la API: { "code": "...", "message": "..." }
export const errorMiddleware = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof AppException) {
    res.status(err.statusCode).json({
      code: err.code,
      message: err.message,
    });

    return;
  }

  // Error inesperado: se registra completo pero al cliente no se le expone el detalle
  logger.error("Unexpected error", { error: err });

  const error = AppErrors.INTERNAL_SERVER_ERROR;
  res.status(error.statusCode).json({
    code: error.code,
    message: error.message,
  });
};