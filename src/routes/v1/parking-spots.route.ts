import { Router } from "express";
import { container } from "../../config/container";
import { ParkingSpotsController } from "../../controllers/parking-spots.controller";

const router = Router();

router.get("/", async (req, res) => {
  const controller = container.resolve<ParkingSpotsController>("parkingSpotsController");

  return controller.getParkingSpots(req, res);
});

router.get("/:id", async (req, res) => {
  const controller = container.resolve<ParkingSpotsController>("parkingSpotsController");

  return controller.getParkingSpotById(req, res);
});

export default router;