import { Router } from "express";
import { container } from "../../config/container";
import { ParkingSpotsController } from "../../controllers/parking-spots.controller";

const router = Router();

router.get("/", async (req, res) => {
  const controller = container.resolve<ParkingSpotsController>("parkingSpotsController");

  return controller.getParkingSpots(req, res);
});

export default router;