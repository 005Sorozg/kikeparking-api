import { Request, Response } from "express";
import {
  IParkingSpotsService,
  ParkingSpotsFilters,
  ParkingSpotsSort,
} from "../services/interfaces/parking-spots.interface";

export class ParkingSpotsController {
  constructor(readonly parkingSpotsService: IParkingSpotsService) {}

  getParkingSpots = async (req: Request, res: Response): Promise<void> => {
    const filters: ParkingSpotsFilters = {
      search: req.query.search as string | undefined,
      onlyAvailable: req.query.onlyAvailable === "true",
      sort: req.query.sort as ParkingSpotsSort | undefined,
    };

    const result = await this.parkingSpotsService.getParkingSpots(filters);

    res.status(200).json(result);
  };
}