import { Router } from "express";
import parkingSpotsRoutes from "./parking-spots.route";
import usersRoutes from "./users.route";
import bookingsRoutes from "./bookings.route";

const router = Router();

router.use("/parking-spots", parkingSpotsRoutes);
router.use("/users", usersRoutes);
router.use("/bookings", bookingsRoutes);

export default router;