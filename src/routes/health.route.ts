import { Router } from "express";
import { container } from "../config/container";
import { HealthController } from "../controllers/health.controller";

const router = Router();

router.get("/", async (req, res) => {
  const controller = container.resolve<HealthController>("healthController");

  return controller.health(req, res);
});

export default router;