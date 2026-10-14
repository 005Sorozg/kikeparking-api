import { Router } from "express";
import { container } from "../../config/container";
import { UsersController } from "../../controllers/users.controller";

const router = Router();

router.post("/register", async (req, res) => {
  const controller = container.resolve<UsersController>("usersController");

  return controller.register(req, res);
});

router.post("/login", async (req, res) => {
  const controller = container.resolve<UsersController>("usersController");

  return controller.login(req, res);
});

export default router;