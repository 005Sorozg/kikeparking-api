// Datos que envía el conductor para abrir un chat con el dueño de un parqueadero
export interface StartConversationRequestDTO {
  parkingSpotId: number;
}

export interface SendMessageRequestDTO {
  text: string;
}

export interface UpdateConversationRequestDTO {
  archived: boolean;
}

export interface MessageResponseDTO {
  id: number;
  text: string;
  senderId: number;
  // true si lo envió quien está consultando (para pintar la burbuja a la derecha)
  mine: boolean;
  createdAt: string;
}

// Un chat de la lista
export interface ConversationResponseDTO {
  id: number;
  parkingSpot: {
    id: number;
    title: string;
    neighborhood: string;
    coverUrl: string | null;
  };
  // La otra persona del chat
  otherUser: {
    id: number;
    name: string;
    avatarUrl: string | null;
  };
  lastMessage: MessageResponseDTO | null;
  unreadCount: number;
  archived: boolean;
  lastMessageAt: string;
}