import express from "express";
import { scopePerRequest } from "awilix-express";
import { container } from "./config/container";
import { env } from "./config/env";
import v1Router from "./routes/v1";
import healthRouter from "./routes/health.route";
import { errorMiddleware } from "./middlewares/error.middleware";
import { AppErrors } from "./exceptions/errors/app.error";

export const createServer = () => {
  const app = express();

  app.use(express.json());
  app.use(scopePerRequest(container));

  // El versionamiento va en la URL: /kikeparking-api/v1/...
  app.use(`${env.apiPrefix}/v1`, v1Router);
  app.use(`${env.apiPrefix}/health`, healthRouter);

  // Cualquier ruta que no exista responde con el mismo formato de error
  app.use((_req, res) => {
    const error = AppErrors.ROUTE_NOT_FOUND;
    res.status(error.statusCode).json({
      code: error.code,
      message: error.message,
    });
  });

  // Siempre debe ir al final
  app.use(errorMiddleware);

  return app;
};