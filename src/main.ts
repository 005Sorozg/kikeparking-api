import { createServer } from "./server";
import { env } from "./config/env";
import { logger } from "./config/logger";

function bootstrap() {
  const app = createServer();

  const server = app.listen(env.port, () => {
    logger.info(`${env.appName} v${env.appVersion}`);
    logger.info(`Environment: ${env.nodeEnv}`);
    logger.info(`Running on port ${env.port}`);
  });

  // Cierre ordenado: deja de aceptar peticiones antes de terminar el proceso
  const shutdown = () => {
    logger.info("Shutting down gracefully...");

    server.close(() => {
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

bootstrap();