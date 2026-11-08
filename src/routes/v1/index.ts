import { Router } from "express";
import parkingSpotsRoutes from "./parking-spots.route";
import usersRoutes from "./users.route";
import bookingsRoutes from "./bookings.route";
import favoritesRoutes from "./favorites.route";
import conversationsRoutes from "./conversations.route";

const router = Router();

router.use("/parking-spots", parkingSpotsRoutes);
router.use("/users", usersRoutes);
router.use("/conversations", conversationsRoutes);
router.use("/bookings", bookingsRoutes);
router.use("/favorites", favoritesRoutes);

export default router;