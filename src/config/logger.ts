import winston from "winston";
import { env } from "./env";

// Logs en formato JSON con fecha, pensados para leerse en consola o en un agregador
export const logger = winston.createLogger({
  level: env.logLevel,
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [new winston.transports.Console()],
});