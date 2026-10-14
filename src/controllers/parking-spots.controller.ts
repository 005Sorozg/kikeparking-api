import { Request, Response } from "express";
import { CreateParkingSpotRequestDTO } from "../dto/parking-spots.dto";
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

  getParkingSpotById = async (req: Request, res: Response): Promise<void> => {
    // El id llega como texto desde la URL, así que se convierte a número
    const id = Number(req.params.id);

    const result = await this.parkingSpotsService.getParkingSpotById(id);

    res.status(200).json(result);
  };

  createParkingSpot = async (req: Request, res: Response): Promise<void> => {
    // El servicio valida el cuerpo, porque el cliente puede mandar cualquier cosa
    const body = req.body as CreateParkingSpotRequestDTO;

    const result = await this.parkingSpotsService.createParkingSpot(body);

    // 201 significa "creado", a diferencia del 200 de las consultas
    res.status(201).json(result);
  };
}