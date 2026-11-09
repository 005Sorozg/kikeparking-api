import { Router } from "express";
import { container } from "../../config/container";
import { UsersController } from "../../controllers/users.controller";
import { requireAuth } from "../../middlewares/auth.middleware";
import { uploadSingleImage } from "../../middlewares/upload.middleware";
import { ReviewsController } from "../../controllers/reviews.controller";

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

// Calificación del usuario que inició sesión (conductor o propietario)
router.get("/me/rating", requireAuth, async (req, res) => {
  const controller = container.resolve<ReviewsController>("reviewsController");

  return controller.getMyRating(req, res);
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

// Datos del perfil del usuario que inició sesión (cualquier rol)
router.patch("/me", requireAuth, async (req, res) => {
  const controller = container.resolve<UsersController>("usersController");

  return controller.updateProfile(req, res);
});

// Cambio de contraseña del usuario que inició sesión (cualquier rol)
router.patch("/me/password", requireAuth, async (req, res) => {
  const controller = container.resolve<UsersController>("usersController");

  return controller.changePassword(req, res);
});
export default router;