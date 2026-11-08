import { Router } from "express";
import { container } from "../../config/container";
import { UsersController } from "../../controllers/users.controller";
import { requireAuth } from "../../middlewares/auth.middleware";
import { uploadSingleImage } from "../../middlewares/upload.middleware";

const router = Router();

router.post("/register", async (req, res) => {
  const controller = container.resolve<UsersController>("usersController");

  return controller.register(req, res);
});

router.post("/login", async (req, res) => {
  const controller = container.resolve<UsersController>("usersController");

  return controller.login(req, res);
});

router.get("/", async (req, res) => {
  const controller = container.resolve<UsersController>("usersController");

  return controller.getAll(req, res);
});

// Foto de perfil del usuario que inició sesión (cualquier rol)
router.post("/me/avatar", requireAuth, uploadSingleImage("avatar"), async (req, res) => {
  const controller = container.resolve<UsersController>("usersController");

  return controller.updateAvatar(req, res);
});

router.delete("/me/avatar", requireAuth, async (req, res) => {
  const controller = container.resolve<UsersController>("usersController");

  return controller.removeAvatar(req, res);
});

export default router;