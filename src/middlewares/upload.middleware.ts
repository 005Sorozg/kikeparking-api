import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { AppException } from "../exceptions/app.exception";
import { AppErrors } from "../exceptions/errors/app.error";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

// El archivo se queda en memoria (no se guarda en disco): de ahí se sube a Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE, files: 1 },
  fileFilter: (_req, file, callback) => {
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      const error = AppErrors.UPLOAD_INVALID_FILE;

      callback(new AppException(error.code, error.message, error.statusCode));

      return;
    }

    callback(null, true);
  },
});

// Recibe un solo archivo en el campo "fieldName" y deja el resultado en req.file.
// Traduce los errores de multer al formato de error de la API.
export function uploadSingleImage(fieldName: string) {
  const handler = upload.single(fieldName);

  return (req: Request, res: Response, next: NextFunction): void => {
    handler(req, res, (err: unknown) => {
      if (err instanceof multer.MulterError) {
        const error =
          err.code === "LIMIT_FILE_SIZE" ? AppErrors.UPLOAD_FILE_TOO_LARGE : AppErrors.UPLOAD_INVALID_FILE;

        next(new AppException(error.code, error.message, error.statusCode));

        return;
      }

      next(err);
    });
  };
}