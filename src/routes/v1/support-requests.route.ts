import { Router } from "express";
import { container } from "../../config/container";
import { SupportRequestsController } from "../../controllers/support-requests.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = Router();

// Cualquier usuario con sesión (conductor o propietario) puede escribir a soporte
router.post("/", requireAuth, async (req, res) => {
  const controller = container.resolve<SupportRequestsController>("supportRequestsController");

  return controller.create(req, res);
});

export default router;