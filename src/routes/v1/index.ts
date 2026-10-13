import { Router } from "express";
import parkingSpotsRoutes from "./parking-spots.route";

const router = Router();

router.use("/parking-spots", parkingSpotsRoutes);

export default router;