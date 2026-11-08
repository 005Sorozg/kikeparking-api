import { createContainer, asClass, InjectionMode } from "awilix";
import { HealthController } from "../controllers/health.controller";
import { ParkingSpotsController } from "../controllers/parking-spots.controller";
import { UsersController } from "../controllers/users.controller";
import { ParkingSpotsService } from "../services/parking-spots.service";
import { UsersService } from "../services/users.service";
import { ParkingSpotsRepository } from "../repositories/parking-spots.repository";
import { UsersRepository } from "../repositories/users.repository";
import { BookingsController } from "../controllers/bookings.controller";
import { BookingsService } from "../services/bookings.service";     
import { BookingsRepository } from "../repositories/bookings.repository";
import { CloudinaryImageStorage } from "../services/cloudinary-image-storage.service";
import { FavoritesController } from "../controllers/favorites.controller";
import { FavoritesService } from "../services/favorites.service";
import { FavoritesRepository } from "../repositories/favorites.repository";

// Modo CLASSIC: awilix inyecta según el nombre de cada parámetro del constructor
export const container = createContainer({
  injectionMode: InjectionMode.CLASSIC,
});

container.register({
  // controllers
  healthController: asClass(HealthController).scoped(),
  parkingSpotsController: asClass(ParkingSpotsController).scoped(),
  usersController: asClass(UsersController).scoped(),
  bookingsController: asClass(BookingsController).scoped(),
  favoritesController: asClass(FavoritesController).scoped(),
  
  // services
  parkingSpotsService: asClass(ParkingSpotsService).scoped(),
  usersService: asClass(UsersService).scoped(),
  bookingsService: asClass(BookingsService).scoped(),
  favoritesService: asClass(FavoritesService).scoped(),

  // repositories
  parkingSpotsRepository: asClass(ParkingSpotsRepository).scoped(),
  usersRepository: asClass(UsersRepository).scoped(),
  bookingsRepository: asClass(BookingsRepository).scoped(),
  favoritesRepository: asClass(FavoritesRepository).scoped(),

  // infrastructure
  imageStorage: asClass(CloudinaryImageStorage).scoped(),
});