import { Request, Response } from "express";
import {
  SendMessageRequestDTO,
  StartConversationRequestDTO,
  UpdateConversationRequestDTO,
} from "../dto/conversations.dto";
import { IConversationsService } from "../services/interfaces/conversations.interface";

export class ConversationsController {
  constructor(readonly conversationsService: IConversationsService) {}

  startConversation = async (req: Request, res: Response): Promise<void> => {
    const body = req.body as StartConversationRequestDTO;

    const result = await this.conversationsService.startConversation(Number(body?.parkingSpotId), req.user!.id);

    res.status(200).json(result);
  };

  getConversations = async (req: Request, res: Response): Promise<void> => {
    // ?archived=true para ver los archivados; sin él, los de la lista principal
    const archived = req.query.archived === "true";

    const result = await this.conversationsService.getConversations(req.user!.id, archived);

    res.status(200).json(result);
  };

  getMessages = async (req: Request, res: Response): Promise<void> => {
    // ?after=15 devuelve solo los mensajes con id mayor a 15 (los nuevos)
    const afterId = req.query.after !== undefined ? Number(req.query.after) : undefined;

    const result = await this.conversationsService.getMessages(Number(req.params.id), req.user!.id, afterId);

    res.status(200).json(result);
  };

  sendMessage = async (req: Request, res: Response): Promise<void> => {
    const body = req.body as SendMessageRequestDTO;

    const result = await this.conversationsService.sendMessage(Number(req.params.id), req.user!.id, body?.text);

    res.status(201).json(result);
  };

  updateConversation = async (req: Request, res: Response): Promise<void> => {
    const body = req.body as UpdateConversationRequestDTO;

    await this.conversationsService.setArchived(Number(req.params.id), req.user!.id, body?.archived);

    res.status(204).send();
  };

  deleteConversation = async (req: Request, res: Response): Promise<void> => {
    await this.conversationsService.deleteForUser(Number(req.params.id), req.user!.id);

    res.status(204).send();
  };
}