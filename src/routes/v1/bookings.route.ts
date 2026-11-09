import { Router } from "express";
import { container } from "../../config/container";
import { BookingsController } from "../../controllers/bookings.controller";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware";
import { ReviewsController } from "../../controllers/reviews.controller";

const router = Router();

// Todas las rutas de reservas exigen sesión iniciada
router.use(requireAuth);

// Solo los conductores reservan
router.post("/", requireRole("conductor"), async (req, res) => {
  const controller = container.resolve<BookingsController>("bookingsController");

  return controller.createBooking(req, res);
});

// Reservas que hizo el conductor
router.get("/mine", requireRole("conductor"), async (req, res) => {
  const controller = container.resolve<BookingsController>("bookingsController");

  return controller.getMyBookings(req, res);
});

// Reservas que recibió el propietario en sus parqueaderos
router.get("/received", requireRole("propietario"), async (req, res) => {
  const controller = container.resolve<BookingsController>("bookingsController");

  return controller.getReceivedBookings(req, res);
});

// Horarios ocupados de un parqueadero (?parkingSpotId=1), para no ofrecerlos al reservar
router.get("/occupied", async (req, res) => {
  const controller = container.resolve<BookingsController>("bookingsController");

  return controller.getOccupiedSlots(req, res);
});

// Cancela el conductor que reservó o el dueño del parqueadero (lo revisa el servicio)
router.patch("/:id/cancel", async (req, res) => {
  const controller = container.resolve<BookingsController>("bookingsController");

  return controller.cancelBooking(req, res);
});

// Calificar una reserva completada: el conductor califica el parqueadero
// y el propietario califica al conductor (lo decide el servicio según quién envía)
router.post("/:id/review", async (req, res) => {
  const controller = container.resolve<ReviewsController>("reviewsController");

  return controller.createReview(req, res);
});

export default router;