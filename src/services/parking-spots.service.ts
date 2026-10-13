import { ParkingSpotResponseDTO } from "../dto/parking-spots.dto";
import { AppException } from "../exceptions/app.exception";
import { AppErrors } from "../exceptions/errors/app.error";
import { IParkingSpotsRepository } from "../repositories/interfaces/parking-spots.interface";
import {
  IParkingSpotsService,
  PARKING_SORT_OPTIONS,
  ParkingSpotsFilters,
} from "./interfaces/parking-spots.interface";

export class ParkingSpotsService implements IParkingSpotsService {
  constructor(readonly parkingSpotsRepository: IParkingSpotsRepository) {}

  async getParkingSpots(filters?: ParkingSpotsFilters): Promise<ParkingSpotResponseDTO[]> {
    // El valor llega del query string, así que se valida en tiempo de ejecución
    if (filters?.sort && !(PARKING_SORT_OPTIONS as readonly string[]).includes(filters.sort)) {
      const error = AppErrors.PARKING_INVALID_SORT;

      throw new AppException(error.code, error.message, error.statusCode);
    }

    const spots = await this.parkingSpotsRepository.getParkingSpotsByFilters(filters);

    return spots.map((spot) => ({
      id: spot.id,
      title: spot.title,
      neighborhood: spot.neighborhood,
      address: spot.address,
      pricePerHour: spot.pricePerHour,
      available: spot.available,
      rating: spot.rating,
    }));
  }
}