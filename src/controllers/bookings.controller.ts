import { Request, Response } from "express";
import { CreateBookingRequestDTO, PayBookingRequestDTO } from "../dto/bookings.dto";
import { IBookingsService } from "../services/interfaces/bookings.interface";

export class BookingsController {
  constructor(readonly bookingsService: IBookingsService) {}

  createBooking = async (req: Request, res: Response): Promise<void> => {
    // El servicio valida el cuerpo, porque el cliente puede mandar cualquier cosa
    const body = req.body as CreateBookingRequestDTO;

    // El conductor sale del token, nunca del cuerpo de la petición
    const result = await this.bookingsService.createBooking(body, req.user!.id);

    res.status(201).json(result);
  };

  getMyBookings = async (req: Request, res: Response): Promise<void> => {
    const result = await this.bookingsService.getMyBookings(req.user!.id);

    res.status(200).json(result);
  };

  getReceivedBookings = async (req: Request, res: Response): Promise<void> => {
  // ?parkingSpotId=3 es opcional: sin él llegan las reservas de todos sus parqueaderos
    const parkingSpotId =
      req.query.parkingSpotId !== undefined ? Number(req.query.parkingSpotId) : undefined;

    const result = await this.bookingsService.getReceivedBookings(req.user!.id, parkingSpotId);

    res.status(200).json(result);
  };

  getOccupiedSlots = async (req: Request, res: Response): Promise<void> => {
  // El id llega como texto desde el query string, así que se convierte a número
    const parkingSpotId = Number(req.query.parkingSpotId);

    const result = await this.bookingsService.getOccupiedSlots(parkingSpotId);

    res.status(200).json(result);
  };

  cancelBooking = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);

      const result = await this.bookingsService.cancelBooking(id, req.user!.id);

    res.status(200).json(result);
  };

  payBooking = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    const body = req.body as PayBookingRequestDTO;

    const result = await this.bookingsService.payBooking(id, body, req.user!.id);

    res.status(200).json(result);
  };
}