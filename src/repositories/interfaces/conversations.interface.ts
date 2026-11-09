import { ConversationListItem, ConversationParticipant, Message } from "../../data/models/conversation.model";

export interface IConversationsRepository {
  // Devuelve el id del chat de ese conductor sobre ese parqueadero; si no existe, lo crea
  // junto con las filas de participante del conductor y del propietario
  findOrCreateConversation(parkingSpotId: number, driverId: number, ownerId: number): Promise<number>;
  getParticipant(conversationId: number, userId: number): Promise<ConversationParticipant | undefined>;
  // Chats visibles para el usuario (no eliminados), archivados o no, del más reciente al más antiguo
  getConversations(userId: number, archived: boolean): Promise<ConversationListItem[]>;
  // Total de mensajes sin leer del usuario, sumando todos sus chats visibles
  countUnread(userId: number): Promise<number>;
  // Mensajes del chat posteriores a "afterId" y a "since" (la fecha en que lo eliminó, si lo hizo)
  getMessages(conversationId: number, afterId?: number, since?: Date | null): Promise<Message[]>;
  // Guarda el mensaje y hace que el chat vuelva a aparecer para la otra persona
  createMessage(conversationId: number, senderId: number, text: string): Promise<Message>;
  updateParticipant(
    conversationId: number,
    userId: number,
    changes: Partial<Pick<ConversationParticipant, "lastReadAt" | "archived" | "deleted" | "clearedAt">>,
  ): Promise<void>;
}