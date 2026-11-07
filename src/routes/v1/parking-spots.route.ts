import { Router } from "express";
import { container } from "../../config/container";
import { ParkingSpotsController } from "../../controllers/parking-spots.controller";
import { requireAuth, requireRole  } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/", async (req, res) => {
  const controller = container.resolve<ParkingSpotsController>("parkingSpotsController");

  return controller.getParkingSpots(req, res);
});

router.get("/mine", requireAuth, requireRole("propietario"), async (req, res) => {
  const controller = container.resolve<ParkingSpotsController>("parkingSpotsController");

  return controller.getMyParkingSpots(req, res);
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

export default router;