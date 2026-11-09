import { Request, Response } from "express";
import { CreateParkingSpotRequestDTO, UpdateAvailabilityRequestDTO, UpdateParkingSpotRequestDTO } from "../dto/parking-spots.dto";
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
      vehicle: req.query.vehicle as "carro" | "moto" | undefined,
      covered: req.query.covered === "true",
      hasSecurity: req.query.hasSecurity === "true",
      hasCameras: req.query.hasCameras === "true",
      hasEvCharging: req.query.hasEvCharging === "true",
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

    // req.user lo deja el middleware requireAuth, que corre antes que este método
    const result = await this.parkingSpotsService.createParkingSpot(body, req.user!.id);

    // 201 significa "creado", a diferencia del 200 de las consultas
    res.status(201).json(result);
  };

  getMyParkingSpots = async (req: Request, res: Response): Promise<void> => {
    const result = await this.parkingSpotsService.getMyParkingSpots(req.user!.id);

    res.status(200).json(result);
  };

  updateAvailability = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    const body = req.body as UpdateAvailabilityRequestDTO;

    const result = await this.parkingSpotsService.updateAvailability(id, body, req.user!.id);

    res.status(200).json(result);
  };

    updateParkingSpot = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    const body = req.body as UpdateParkingSpotRequestDTO;

    const result = await this.parkingSpotsService.updateParkingSpot(id, body, req.user!.id);

    res.status(200).json(result);
  };

    addPhoto = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);

    // req.file lo deja listo el middleware de subida
    const result = await this.parkingSpotsService.addPhoto(id, req.file, req.user!.id);

    res.status(201).json(result);
  };

  removePhoto = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    const photoId = Number(req.params.photoId);

    const result = await this.parkingSpotsService.removePhoto(id, photoId, req.user!.id);

    res.status(200).json(result);
  };
}