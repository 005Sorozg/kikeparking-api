import { ConversationResponseDTO, MessageResponseDTO } from "../../dto/conversations.dto";

export interface IConversationsService {
  startConversation(parkingSpotId: number, driverId: number): Promise<ConversationResponseDTO>;
  getConversations(userId: number, archived: boolean): Promise<ConversationResponseDTO[]>;
  getUnreadCount(userId: number): Promise<number>;  
  getMessages(conversationId: number, userId: number, afterId?: number): Promise<MessageResponseDTO[]>;
  sendMessage(conversationId: number, userId: number, text: unknown): Promise<MessageResponseDTO>;
  setArchived(conversationId: number, userId: number, archived: unknown): Promise<void>;
  deleteForUser(conversationId: number, userId: number): Promise<void>;
}