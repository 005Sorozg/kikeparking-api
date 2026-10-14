import { createContainer, asClass, InjectionMode } from "awilix";
import { HealthController } from "../controllers/health.controller";
import { ParkingSpotsController } from "../controllers/parking-spots.controller";
import { UsersController } from "../controllers/users.controller";
import { ParkingSpotsService } from "../services/parking-spots.service";
import { UsersService } from "../services/users.service";
import { ParkingSpotsRepository } from "../repositories/parking-spots.repository";
import { UsersRepository } from "../repositories/users.repository";

// Modo CLASSIC: awilix inyecta según el nombre de cada parámetro del constructor
export const container = createContainer({
  injectionMode: InjectionMode.CLASSIC,
});

container.register({
  // controllers
  healthController: asClass(HealthController).scoped(),
  parkingSpotsController: asClass(ParkingSpotsController).scoped(),
  usersController: asClass(UsersController).scoped(),
  
  // services
  parkingSpotsService: asClass(ParkingSpotsService).scoped(),
  usersService: asClass(UsersService).scoped(),

  // repositories
  parkingSpotsRepository: asClass(ParkingSpotsRepository).scoped(),
  usersRepository: asClass(UsersRepository).scoped(),
});