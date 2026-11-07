import dotenv from "dotenv";
import packageJson from "../../package.json";

dotenv.config();

const nodeEnv = process.env.NODE_ENV || "development";

// En producción no se permite la clave de desarrollo: cualquiera que la conozca
// podría fabricar tokens válidos y entrar como cualquier usuario
if (nodeEnv === "production" && !process.env.JWT_SECRET) {
  throw new Error("Falta la variable de entorno JWT_SECRET");
}

// Configuración centralizada: el resto de la app nunca lee process.env directamente
export const env = {
  nodeEnv,
  appName: packageJson.name,
  appVersion: packageJson.version,
  port: process.env.PORT ? Number(process.env.PORT) : 3000,
  logLevel: process.env.LOG_LEVEL || "info",
  apiPrefix: process.env.API_PREFIX || "/kikeparking-api",
  jwtSecret: process.env.JWT_SECRET || "dev-secret",
};