export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  text: string;
  createdAt: Date;
}

// Cómo ve una persona un chat (archivado, eliminado, hasta dónde leyó)
export interface ConversationParticipant {
  conversationId: number;
  userId: number;
  lastReadAt: Date;
  archived: boolean;
  deleted: boolean;
  clearedAt: Date | null;
}

// Un chat de la lista, tal como lo arma el repositorio para un usuario
export interface ConversationListItem {
  participant: ConversationParticipant;
  conversation: {
    id: number;
    lastMessageAt: Date;
    parkingSpot: {
      id: number;
      title: string;
      neighborhood: string;
      // Primera foto del parqueadero (o null si no tiene)
      coverUrl: string | null;
    };
  };
  otherUser: {
    id: number;
    name: string;
    avatarUrl: string | null;
  };
  lastMessage: Message | null;
  unreadCount: number;
}