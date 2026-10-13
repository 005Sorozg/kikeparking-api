import { ParkingSpot } from "../data/models/parking-spot.model";
import { parkingSpotData } from "../data/parking-spots.data";
import { ParkingSpotsFilters } from "../services/interfaces/parking-spots.interface";
import { IParkingSpotsRepository } from "./interfaces/parking-spots.interface";

export class ParkingSpotsRepository implements IParkingSpotsRepository {
  async getParkingSpotsByFilters(filters?: ParkingSpotsFilters): Promise<ParkingSpot[]> {
    let spots = parkingSpotData;

    // El texto se busca en el barrio y en el título, sin distinguir mayúsculas
    if (filters?.search) {
      const text = filters.search.toLowerCase();

      spots = spots.filter(
        (spot) =>
          spot.neighborhood.toLowerCase().includes(text) ||
          spot.title.toLowerCase().includes(text),
      );
    }

    if (filters?.onlyAvailable) {
      spots = spots.filter((spot) => spot.available);
    }

    // Se copia el arreglo antes de ordenar para no modificar los datos originales
    if (filters?.sort === "rating") {
      spots = [...spots].sort((a, b) => b.rating - a.rating);
    }

    if (filters?.sort === "price") {
      spots = [...spots].sort((a, b) => a.pricePerHour - b.pricePerHour);
    }

    return spots;
  }

  async getParkingSpotById(id: number): Promise<ParkingSpot | undefined> {
    return parkingSpotData.find((spot) => spot.id === id);
  }
}