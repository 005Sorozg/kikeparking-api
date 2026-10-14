import dotenv from "dotenv";
import packageJson from "../../package.json";

dotenv.config();

// Configuración centralizada: el resto de la app nunca lee process.env directamente
export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  appName: packageJson.name,
  appVersion: packageJson.version,
  port: process.env.PORT ? Number(process.env.PORT) : 3000,
  logLevel: process.env.LOG_LEVEL || "info",
  apiPrefix: process.env.API_PREFIX || "/kikeparking-api",
  jwtSecret: process.env.JWT_SECRET || "dev-secret"
};