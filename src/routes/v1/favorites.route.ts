import { Router } from "express";
import { container } from "../../config/container";
import { FavoritesController } from "../../controllers/favorites.controller";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware";

const router = Router();

// Los favoritos son de los conductores: todas las rutas exigen sesión y ese rol
router.use(requireAuth, requireRole("conductor"));

// Parqueaderos guardados por el conductor
router.get("/", async (req, res) => {
  const controller = container.resolve<FavoritesController>("favoritesController");

  return controller.getFavorites(req, res);
});

// Guardar un parqueadero (si ya estaba guardado, no pasa nada)
router.put("/:parkingSpotId", async (req, res) => {
  const controller = container.resolve<FavoritesController>("favoritesController");

  return controller.addFavorite(req, res);
});

// Quitarlo de favoritos (si no estaba, tampoco pasa nada)
router.delete("/:parkingSpotId", async (req, res) => {
  const controller = container.resolve<FavoritesController>("favoritesController");

  return controller.removeFavorite(req, res);
});

export default router;