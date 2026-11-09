import { Router } from "express";
import { container } from "../../config/container";
import { ParkingSpotsController } from "../../controllers/parking-spots.controller";
import { requireAuth, requireRole  } from "../../middlewares/auth.middleware";
import { uploadSingleImage } from "../../middlewares/upload.middleware";
import { ReviewsController } from "../../controllers/reviews.controller";

const router = Router();

router.get("/", async (req, res) => {
  const controller = container.resolve<ParkingSpotsController>("parkingSpotsController");

  return controller.getParkingSpots(req, res);
});

router.get("/mine", requireAuth, requireRole("propietario"), async (req, res) => {
  const controller = container.resolve<ParkingSpotsController>("parkingSpotsController");

  return controller.getMyParkingSpots(req, res);
});

// Los más cercanos a un punto: /nearby?lat=6.24&lng=-75.58&limit=10 (público).
// Va antes de "/:id" para que Express no confunda "nearby" con un id.
router.get("/nearby", async (req, res) => {
  const controller = container.resolve<ParkingSpotsController>("parkingSpotsController");

  return controller.getNearbyParkingSpots(req, res);
});

// Reseñas de un parqueadero (públicas, como el detalle)
router.get("/:id/reviews", async (req, res) => {
  const controller = container.resolve<ReviewsController>("reviewsController");

  return controller.getParkingSpotReviews(req, res);
});

router.get("/:id", async (req, res) => {
  const controller = container.resolve<ParkingSpotsController>("parkingSpotsController");

  return controller.getParkingSpotById(req, res);
});

router.post("/", requireAuth, requireRole("propietario"), async (req, res) => {
  const controller = container.resolve<ParkingSpotsController>("parkingSpotsController");

  return controller.createParkingSpot(req, res);
});

// Pausar o reactivar un parqueadero (solo su dueño, lo revisa el servicio)
router.patch("/:id/availability", requireAuth, requireRole("propietario"), async (req, res) => {
  const controller = container.resolve<ParkingSpotsController>("parkingSpotsController");

  return controller.updateAvailability(req, res);
});

// Editar la información de un parqueadero (solo su dueño, lo revisa el servicio)
router.patch("/:id", requireAuth, requireRole("propietario"), async (req, res) => {
  const controller = container.resolve<ParkingSpotsController>("parkingSpotsController");

  return controller.updateParkingSpot(req, res);
});

// Agregar una foto al parqueadero (solo su dueño, lo revisa el servicio)
router.post("/:id/photos", requireAuth, requireRole("propietario"), uploadSingleImage("photo"), async (req, res) => {
  const controller = container.resolve<ParkingSpotsController>("parkingSpotsController");

  return controller.addPhoto(req, res);
});

// Borrar una foto del parqueadero (solo su dueño)
router.delete("/:id/photos/:photoId", requireAuth, requireRole("propietario"), async (req, res) => {
  const controller = container.resolve<ParkingSpotsController>("parkingSpotsController");

  return controller.removePhoto(req, res);
});

export default router;