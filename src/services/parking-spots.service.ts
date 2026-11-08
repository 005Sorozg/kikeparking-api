import { ParkingSpotChanges, ParkingSpotWithPhotos } from "../data/models/parking-spot.model";
import { IImageStorage, UploadedFileData } from "./interfaces/image-storage.interface";
import { CreateParkingSpotRequestDTO, ParkingSpotResponseDTO, UpdateAvailabilityRequestDTO, UpdateParkingSpotRequestDTO } from "../dto/parking-spots.dto";
import { AppException } from "../exceptions/app.exception";
import { AppErrors } from "../exceptions/errors/app.error";
import { IParkingSpotsRepository } from "../repositories/interfaces/parking-spots.interface";
import {
  IParkingSpotsService,
  PARKING_SORT_OPTIONS,
  ParkingSpotsFilters,
} from "./interfaces/parking-spots.interface";

// Cantidad máxima de fotos por parqueadero
const MAX_PHOTOS_PER_SPOT = 5;

export class ParkingSpotsService implements IParkingSpotsService {
    constructor(
    readonly parkingSpotsRepository: IParkingSpotsRepository,
    readonly imageStorage: IImageStorage,
  ) {}

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

  async createParkingSpot(data: CreateParkingSpotRequestDTO, ownerId: number): Promise<ParkingSpotResponseDTO> {
    const problems = this.validateCreateData(data);

    if (problems.length > 0) {
      const error = AppErrors.PARKING_INVALID_DATA;

      throw new AppException(error.code, `${error.message}: ${problems.join(", ")}`, error.statusCode);
    }


    // Todo parqueadero nuevo nace disponible y sin calificación
    const spot = await this.parkingSpotsRepository.createParkingSpot({
      title: data.title.trim(),
      neighborhood: data.neighborhood.trim(),
      address: data.address.trim(),
      pricePerHour: data.pricePerHour,
      available: true,
      rating: 0,
      ownerId: ownerId,
    });

    return this.toResponseDTO(spot);
  }

  async getMyParkingSpots(ownerId: number): Promise<ParkingSpotResponseDTO[]> {
    const spots = await this.parkingSpotsRepository.getParkingSpotsByOwner(ownerId);

    return spots.map((spot) => this.toResponseDTO(spot));
  }

      // Pausar (available: false) o reactivar (available: true) un parqueadero.
    // Pausado no recibe reservas nuevas; las que ya tenía se mantienen.
  async updateAvailability(
    id: number,
    data: UpdateAvailabilityRequestDTO,
    ownerId: number,
  ): Promise<ParkingSpotResponseDTO> {
    if (!Number.isInteger(id) || id <= 0) {
      const error = AppErrors.PARKING_INVALID_ID;

      throw new AppException(error.code, error.message, error.statusCode);
    }

    if (typeof data?.available !== "boolean") {
      const error = AppErrors.PARKING_INVALID_DATA;

      throw new AppException(error.code, `${error.message}: available debe ser true o false`, error.statusCode);
    }

    const spot = await this.parkingSpotsRepository.getParkingSpotById(id);

    if (!spot) {
      const error = AppErrors.PARKING_NOT_FOUND;

      throw new AppException(error.code, error.message, error.statusCode);
    }

    // Solo el dueño puede pausar o reactivar su parqueadero
    if (spot.ownerId !== ownerId) {
      const error = AppErrors.PARKING_NOT_OWNED;

      throw new AppException(error.code, error.message, error.statusCode);
    }

    const updated = await this.parkingSpotsRepository.updateAvailability(id, data.available);

    return this.toResponseDTO(updated);
  }

    // Agrega una foto al parqueadero (máximo 5). Solo el dueño puede hacerlo.
  async addPhoto(id: number, file: UploadedFileData | undefined, ownerId: number): Promise<ParkingSpotResponseDTO> {
    const spot = await this.getOwnedSpot(id, ownerId);

    if (!file) {
      const error = AppErrors.UPLOAD_NO_FILE;

      throw new AppException(error.code, error.message, error.statusCode);
    }

    if (spot.photos.length >= MAX_PHOTOS_PER_SPOT) {
      const error = AppErrors.PARKING_PHOTO_LIMIT;

      throw new AppException(error.code, error.message, error.statusCode);
    }

    const uploaded = await this.imageStorage.upload(file.buffer, {
      folder: `kikeparking/parking-spots/${id}`,
      maxSize: 1600,
    });

    try {
      await this.parkingSpotsRepository.addPhoto(id, uploaded.url, uploaded.publicId);
    } catch (error) {
      // Si no se pudo guardar en la base de datos, se borra la imagen para no dejarla huérfana
      await this.imageStorage.delete(uploaded.publicId);

      throw error;
    }

    return this.toResponseDTO(await this.getOwnedSpot(id, ownerId));
  }

  // Borra una foto del parqueadero. Solo el dueño puede hacerlo.
  async removePhoto(id: number, photoId: number, ownerId: number): Promise<ParkingSpotResponseDTO> {
    const spot = await this.getOwnedSpot(id, ownerId);

    if (!Number.isInteger(photoId) || photoId <= 0) {
      const error = AppErrors.PARKING_PHOTO_INVALID_ID;

      throw new AppException(error.code, error.message, error.statusCode);
    }

    // Se busca entre las fotos de ESTE parqueadero: no se puede borrar la foto de otro
    const photo = spot.photos.find((item) => item.id === photoId);

    if (!photo) {
      const error = AppErrors.PARKING_PHOTO_NOT_FOUND;

      throw new AppException(error.code, error.message, error.statusCode);
    }

    await this.parkingSpotsRepository.deletePhoto(photoId);

    // La foto ya no existe para la app; si falla el borrado en Cloudinary no se interrumpe la respuesta
    await this.imageStorage.delete(photo.publicId).catch(() => undefined);

    return this.toResponseDTO({ ...spot, photos: spot.photos.filter((item) => item.id !== photoId) });
  }

  // Valida el id, busca el parqueadero y confirma que pertenece al propietario
  private async getOwnedSpot(id: number, ownerId: number): Promise<ParkingSpotWithPhotos> {
    if (!Number.isInteger(id) || id <= 0) {
      const error = AppErrors.PARKING_INVALID_ID;

      throw new AppException(error.code, error.message, error.statusCode);
    }

    const spot = await this.parkingSpotsRepository.getParkingSpotById(id);

    if (!spot) {
      const error = AppErrors.PARKING_NOT_FOUND;

      throw new AppException(error.code, error.message, error.statusCode);
    }

    if (spot.ownerId !== ownerId) {
      const error = AppErrors.PARKING_NOT_OWNED;

      throw new AppException(error.code, error.message, error.statusCode);
    }

    return spot;
  }

  // El cuerpo llega del cliente, así que se valida el tipo y el valor de cada campo
  private validateCreateData(data: CreateParkingSpotRequestDTO): string[] {
    const problems: string[] = [];

    if (typeof data?.title !== "string" || data.title.trim().length < 3) {
      problems.push("title debe tener al menos 3 caracteres");
    }

    if (typeof data?.neighborhood !== "string" || data.neighborhood.trim().length < 2) {
      problems.push("neighborhood debe tener al menos 2 caracteres");
    }

    if (typeof data?.address !== "string" || data.address.trim().length < 3) {
      problems.push("address debe tener al menos 3 caracteres");
    }

    if (!Number.isInteger(data?.pricePerHour) || data.pricePerHour <= 0) {
      problems.push("pricePerHour debe ser un número entero mayor que 0");
    }

    return problems;
  }

    // Edición parcial: el propietario envía solo los campos que quiere cambiar
  async updateParkingSpot(
    id: number,
    data: UpdateParkingSpotRequestDTO,
    ownerId: number,
  ): Promise<ParkingSpotResponseDTO> {
    if (!Number.isInteger(id) || id <= 0) {
      const error = AppErrors.PARKING_INVALID_ID;

      throw new AppException(error.code, error.message, error.statusCode);
    }

    const problems = this.validateUpdateData(data);

    if (problems.length > 0) {
      const error = AppErrors.PARKING_INVALID_DATA;

      throw new AppException(error.code, `${error.message}: ${problems.join(", ")}`, error.statusCode);
    }

    const spot = await this.parkingSpotsRepository.getParkingSpotById(id);

    if (!spot) {
      const error = AppErrors.PARKING_NOT_FOUND;

      throw new AppException(error.code, error.message, error.statusCode);
    }

    // Solo el dueño puede editar su parqueadero
    if (spot.ownerId !== ownerId) {
      const error = AppErrors.PARKING_NOT_OWNED;

      throw new AppException(error.code, error.message, error.statusCode);
    }

    // Solo se copian los campos permitidos: rating, ownerId e id nunca se tocan
    const changes: ParkingSpotChanges = {
      ...(data.title !== undefined && { title: data.title.trim() }),
      ...(data.neighborhood !== undefined && { neighborhood: data.neighborhood.trim() }),
      ...(data.address !== undefined && { address: data.address.trim() }),
      ...(data.pricePerHour !== undefined && { pricePerHour: data.pricePerHour }),
    };

    const updated = await this.parkingSpotsRepository.updateParkingSpot(id, changes);

    return this.toResponseDTO(updated);
  }

  // Valida solo los campos que llegaron, y exige que llegue al menos uno
  private validateUpdateData(data: UpdateParkingSpotRequestDTO): string[] {
    const problems: string[] = [];
    const fields = ["title", "neighborhood", "address", "pricePerHour"] as const;

    if (!fields.some((field) => data?.[field] !== undefined)) {
      problems.push("debes enviar al menos un campo para modificar");

      return problems;
    }

    if (data.title !== undefined && (typeof data.title !== "string" || data.title.trim().length < 3)) {
      problems.push("title debe tener al menos 3 caracteres");
    }

    if (data.neighborhood !== undefined && (typeof data.neighborhood !== "string" || data.neighborhood.trim().length < 2)) {
      problems.push("neighborhood debe tener al menos 2 caracteres");
    }

    if (data.address !== undefined && (typeof data.address !== "string" || data.address.trim().length < 3)) {
      problems.push("address debe tener al menos 3 caracteres");
    }

    if (data.pricePerHour !== undefined && (!Number.isInteger(data.pricePerHour) || data.pricePerHour <= 0)) {
      problems.push("pricePerHour debe ser un número entero mayor que 0");
    }

    return problems;
  }

  // Convierte el modelo interno al formato que se devuelve al cliente
    // Convierte el modelo interno al formato que se devuelve al cliente
  private toResponseDTO(spot: ParkingSpotWithPhotos): ParkingSpotResponseDTO {
    return {
      id: spot.id,
      title: spot.title,
      neighborhood: spot.neighborhood,
      address: spot.address,
      pricePerHour: spot.pricePerHour,
      available: spot.available,
      rating: spot.rating,
      ownerId: spot.ownerId,
      photos: spot.photos.map((photo) => ({ id: photo.id, url: photo.url })),
    };
  }
}