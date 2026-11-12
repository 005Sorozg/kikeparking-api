import { Request, Response } from "express";
import { CreateSupportRequestRequestDTO } from "../dto/support-requests.dto";
import { ISupportRequestsService } from "../services/interfaces/support-requests.interface";

export class SupportRequestsController {
  constructor(readonly supportRequestsService: ISupportRequestsService) { }

  create = async (req: Request, res: Response): Promise<void> => {
    // El id sale del token, nunca del cuerpo: nadie puede escribir a nombre de otro usuario
    const body = req.body as CreateSupportRequestRequestDTO;

    const result = await this.supportRequestsService.createSupportRequest(req.user!.id, body);

    res.status(201).json(result);
  };
}