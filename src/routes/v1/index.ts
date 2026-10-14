import { Router } from "express";
import parkingSpotsRoutes from "./parking-spots.route";
import usersRoutes from "./users.route";

const router = Router();

router.use("/parking-spots", parkingSpotsRoutes);
router.use("/users", usersRoutes);

export default router;