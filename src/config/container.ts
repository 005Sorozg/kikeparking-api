import { createContainer, asClass, InjectionMode } from "awilix";
import { HealthController } from "../controllers/health.controller";

// Modo CLASSIC: awilix inyecta según el nombre de cada parámetro del constructor
export const container = createContainer({
  injectionMode: InjectionMode.CLASSIC,
});

container.register({
  // controllers
  healthController: asClass(HealthController).scoped(),
});