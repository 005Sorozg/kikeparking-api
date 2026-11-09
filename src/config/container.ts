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
import { ConversationsController } from "../controllers/conversations.controller";
import { ConversationsService } from "../services/conversations.service";
import { ConversationsRepository } from "../repositories/conversations.repository";
import { SupportRequestsController } from "../controllers/support-requests.controller";
import { SupportRequestsService } from "../services/support-requests.service";
import { SupportRequestsRepository } from "../repositories/support-requests.repository";
import { ReviewsController } from "../controllers/reviews.controller";
import { ReviewsService } from "../services/reviews.service";
import { ReviewsRepository } from "../repositories/reviews.repository";

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
  conversationsController: asClass(ConversationsController).scoped(),
  supportRequestsController: asClass(SupportRequestsController).scoped(),
  reviewsController: asClass(ReviewsController).scoped(),
  
  // services
  parkingSpotsService: asClass(ParkingSpotsService).scoped(),
  usersService: asClass(UsersService).scoped(),
  bookingsService: asClass(BookingsService).scoped(),
  favoritesService: asClass(FavoritesService).scoped(),
  conversationsService: asClass(ConversationsService).scoped(),
  supportRequestsService: asClass(SupportRequestsService).scoped(),
  reviewsService: asClass(ReviewsService).scoped(),

  // repositories
  parkingSpotsRepository: asClass(ParkingSpotsRepository).scoped(),
  usersRepository: asClass(UsersRepository).scoped(),
  bookingsRepository: asClass(BookingsRepository).scoped(),
  favoritesRepository: asClass(FavoritesRepository).scoped(),
  conversationsRepository: asClass(ConversationsRepository).scoped(),
  supportRequestsRepository: asClass(SupportRequestsRepository).scoped(),
  reviewsRepository: asClass(ReviewsRepository).scoped(),

  // infrastructure
  imageStorage: asClass(CloudinaryImageStorage).scoped(),
});