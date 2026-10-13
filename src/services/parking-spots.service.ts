import { ParkingSpot } from "../data/models/parking-spot.model";
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

    return spots.map((spot) => this.toResponseDTO(spot));
  }

  async getParkingSpotById(id: number): Promise<ParkingSpotResponseDTO> {
    // Si en la URL no llega un número entero positivo, id será NaN o inválido
    if (!Number.isInteger(id) || id <= 0) {
      const error = AppErrors.PARKING_INVALID_ID;

      throw new AppException(error.code, error.message, error.statusCode);
    }

    const spot = await this.parkingSpotsRepository.getParkingSpotById(id);

    if (!spot) {
      const error = AppErrors.PARKING_NOT_FOUND;

      throw new AppException(error.code, error.message, error.statusCode);
    }

    return this.toResponseDTO(spot);
  }

  // Convierte el modelo interno al formato que se devuelve al cliente
  private toResponseDTO(spot: ParkingSpot): ParkingSpotResponseDTO {
    return {
      id: spot.id,
      title: spot.title,
      neighborhood: spot.neighborhood,
      address: spot.address,
      pricePerHour: spot.pricePerHour,
      available: spot.available,
      rating: spot.rating,
    };
  }
}