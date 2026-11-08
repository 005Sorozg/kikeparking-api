import { ConversationListItem, ConversationParticipant, Message } from "../data/models/conversation.model";
import { ConversationResponseDTO, MessageResponseDTO } from "../dto/conversations.dto";
import { AppException } from "../exceptions/app.exception";
import { AppErrors } from "../exceptions/errors/app.error";
import { IConversationsRepository } from "../repositories/interfaces/conversations.interface";
import { IParkingSpotsRepository } from "../repositories/interfaces/parking-spots.interface";
import { IConversationsService } from "./interfaces/conversations.interface";

const MAX_MESSAGE_LENGTH = 1000;

export class ConversationsService implements IConversationsService {
  constructor(
    readonly conversationsRepository: IConversationsRepository,
    readonly parkingSpotsRepository: IParkingSpotsRepository,
  ) {}

  // El conductor abre el chat con el dueño del parqueadero (o vuelve al que ya tenía)
  async startConversation(parkingSpotId: number, driverId: number): Promise<ConversationResponseDTO> {
    if (!Number.isInteger(parkingSpotId) || parkingSpotId <= 0) {
      this.fail(AppErrors.PARKING_INVALID_ID);
    }

    const spot = await this.parkingSpotsRepository.getParkingSpotById(parkingSpotId);

    if (!spot) {
      this.fail(AppErrors.PARKING_NOT_FOUND);
    }

    if (spot.ownerId === driverId) {
      this.fail(AppErrors.CONVERSATION_OWN_SPOT);
    }

    const conversationId = await this.conversationsRepository.findOrCreateConversation(
      parkingSpotId,
      driverId,
      spot.ownerId,
    );

    // Si lo había eliminado, vuelve a aparecer (vacío: sus mensajes anteriores siguen ocultos)
    // y si lo había archivado, sale del archivo
    await this.conversationsRepository.updateParticipant(conversationId, driverId, {
      deleted: false,
      archived: false,
    });

    const conversations = await this.conversationsRepository.getConversations(driverId, false);
    const item = conversations.find((c) => c.conversation.id === conversationId);

    if (!item) {
      this.fail(AppErrors.CONVERSATION_NOT_FOUND);
    }

    return this.toConversationDTO(item, driverId);
  }

  async getConversations(userId: number, archived: boolean): Promise<ConversationResponseDTO[]> {
    const items = await this.conversationsRepository.getConversations(userId, archived);

    return items.map((item) => this.toConversationDTO(item, userId));
  }

  // Mensajes del chat. Con afterId solo llegan los nuevos (la app pregunta cada pocos segundos)
  async getMessages(conversationId: number, userId: number, afterId?: number): Promise<MessageResponseDTO[]> {
    const participant = await this.getOwnParticipant(conversationId, userId);

    if (afterId !== undefined && (!Number.isInteger(afterId) || afterId < 0)) {
      this.fail(AppErrors.CONVERSATION_INVALID_DATA, "after debe ser un número entero");
    }

    const messages = await this.conversationsRepository.getMessages(
      conversationId,
      afterId,
      participant.clearedAt,
    );

    // Abrir el chat = leer los mensajes
    await this.conversationsRepository.updateParticipant(conversationId, userId, { lastReadAt: new Date() });

    return messages.map((message) => this.toMessageDTO(message, userId));
  }

  async sendMessage(conversationId: number, userId: number, text: unknown): Promise<MessageResponseDTO> {
    await this.getOwnParticipant(conversationId, userId);

    const clean = typeof text === "string" ? text.trim() : "";

    if (clean.length === 0 || clean.length > MAX_MESSAGE_LENGTH) {
      this.fail(AppErrors.MESSAGE_INVALID_TEXT);
    }

    const message = await this.conversationsRepository.createMessage(conversationId, userId, clean);

    return this.toMessageDTO(message, userId);
  }

  // Archivar o desarchivar: solo cambia la vista de quien lo hace
  async setArchived(conversationId: number, userId: number, archived: unknown): Promise<void> {
    await this.getOwnParticipant(conversationId, userId);

    if (typeof archived !== "boolean") {
      this.fail(AppErrors.CONVERSATION_INVALID_DATA, "archived debe ser true o false");
    }

    await this.conversationsRepository.updateParticipant(conversationId, userId, { archived });
  }

  // "Eliminar para mí": sale de la lista y se ocultan los mensajes hasta hoy.
  // La otra persona conserva su chat completo.
  async deleteForUser(conversationId: number, userId: number): Promise<void> {
    await this.getOwnParticipant(conversationId, userId);

    await this.conversationsRepository.updateParticipant(conversationId, userId, {
      deleted: true,
      archived: false,
      clearedAt: new Date(),
    });
  }

  // Valida el id y confirma que el usuario es parte del chat.
  // Si no lo es, responde "no encontrado" para no revelar que ese chat existe.
  private async getOwnParticipant(conversationId: number, userId: number): Promise<ConversationParticipant> {
    if (!Number.isInteger(conversationId) || conversationId <= 0) {
      this.fail(AppErrors.CONVERSATION_INVALID_ID);
    }

    const participant = await this.conversationsRepository.getParticipant(conversationId, userId);

    if (!participant) {
      this.fail(AppErrors.CONVERSATION_NOT_FOUND);
    }

    return participant;
  }

  // Lanza el error del catálogo; "never" le dice a TypeScript que aquí se corta el flujo
  private fail(error: { code: string; message: string; statusCode: number }, detail?: string): never {
    const message = detail ? `${error.message}: ${detail}` : error.message;

    throw new AppException(error.code, message, error.statusCode);
  }

  private toMessageDTO(message: Message, userId: number): MessageResponseDTO {
    return {
      id: message.id,
      text: message.text,
      senderId: message.senderId,
      mine: message.senderId === userId,
      createdAt: message.createdAt.toISOString(),
    };
  }

  private toConversationDTO(item: ConversationListItem, userId: number): ConversationResponseDTO {
    return {
      id: item.conversation.id,
      parkingSpot: item.conversation.parkingSpot,
      otherUser: item.otherUser,
      lastMessage: item.lastMessage ? this.toMessageDTO(item.lastMessage, userId) : null,
      unreadCount: item.unreadCount,
      archived: item.participant.archived,
      lastMessageAt: item.conversation.lastMessageAt.toISOString(),
    };
  }
}