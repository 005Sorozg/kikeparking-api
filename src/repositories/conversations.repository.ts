import { ConversationListItem, ConversationParticipant, Message } from "../data/models/conversation.model";
import { prisma } from "../config/prisma";
import { IConversationsRepository } from "./interfaces/conversations.interface";

// Máximo de mensajes por consulta (un chat entre conductor y propietario no suele tener más)
const MESSAGES_LIMIT = 200;

export class ConversationsRepository implements IConversationsRepository {
  async findOrCreateConversation(parkingSpotId: number, driverId: number, ownerId: number): Promise<number> {
    // upsert: si ya existe el chat, no crea otro (la llave única es parqueadero + conductor)
    const conversation = await prisma.conversation.upsert({
      where: { parkingSpotId_driverId: { parkingSpotId, driverId } },
      create: {
        parkingSpotId,
        driverId,
        participants: { create: [{ userId: driverId }, { userId: ownerId }] },
      },
      update: {},
    });

    return conversation.id;
  }

  async getParticipant(conversationId: number, userId: number): Promise<ConversationParticipant | undefined> {
    const participant = await prisma.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
    });

    return participant ?? undefined;
  }

  async getConversations(userId: number, archived: boolean): Promise<ConversationListItem[]> {
    const rows = await prisma.conversationParticipant.findMany({
      where: { userId, deleted: false, archived },
      orderBy: { conversation: { lastMessageAt: "desc" } },
      include: {
        conversation: {
          include: {
            parkingSpot: { include: { photos: { orderBy: { id: "asc" }, take: 1 } } },
            // La otra persona del chat
            participants: { where: { userId: { not: userId } }, include: { user: true } },
            messages: { orderBy: { id: "desc" }, take: 1 },
          },
        },
      },
    });

    // Los no leídos dependen de la fecha de lectura de cada fila, así que se cuentan uno por uno
    return Promise.all(
      rows.map(async (row) => {
        const { conversation, ...participant } = row;
        const since = maxDate(participant.lastReadAt, participant.clearedAt);
        const other = conversation.participants[0]?.user;

        const unreadCount = await prisma.message.count({
          where: { conversationId: conversation.id, senderId: { not: userId }, createdAt: { gt: since } },
        });

        const last = conversation.messages[0];

        return {
          participant,
          conversation: {
            id: conversation.id,
            lastMessageAt: conversation.lastMessageAt,
            parkingSpot: {
              id: conversation.parkingSpot.id,
              title: conversation.parkingSpot.title,
              neighborhood: conversation.parkingSpot.neighborhood,
              coverUrl: conversation.parkingSpot.photos[0]?.url ?? null,
            },
          },
          otherUser: {
            id: other?.id ?? 0,
            name: other?.name ?? "Usuario",
            avatarUrl: other?.avatarUrl ?? null,
          },
          // Si el último mensaje es de antes de que lo eliminara, no se le muestra
          lastMessage:
            last && (!participant.clearedAt || last.createdAt > participant.clearedAt) ? last : null,
          unreadCount,
        };
      }),
    );
  }

  async countUnread(userId: number): Promise<number> {
    // Se compara cada mensaje con la fecha de lectura de SU fila de participante, así que
    // se hace en SQL: Prisma no permite comparar dos columnas de tablas distintas en un filtro.
    const [row] = await prisma.$queryRaw<{ total: number }[]>`
      SELECT COUNT(*)::int AS total
      FROM "messages" m
      JOIN "conversation_participants" p
        ON p."conversationId" = m."conversationId" AND p."userId" = ${userId}
      WHERE m."senderId" <> ${userId}
        AND p."deleted" = false
        AND m."createdAt" > GREATEST(p."lastReadAt", COALESCE(p."clearedAt", p."lastReadAt"))
    `;

    return row?.total ?? 0;
  }

  async getMessages(conversationId: number, afterId?: number, since?: Date | null): Promise<Message[]> {
    return prisma.message.findMany({
      where: {
        conversationId,
        ...(afterId !== undefined && { id: { gt: afterId } }),
        ...(since && { createdAt: { gt: since } }),
      },
      orderBy: { id: "asc" },
      take: MESSAGES_LIMIT,
    });
  }

  async createMessage(conversationId: number, senderId: number, text: string): Promise<Message> {
    // Todo en una transacción: el mensaje, la fecha del chat y que reaparezca para el otro
    const [message] = await prisma.$transaction([
      prisma.message.create({ data: { conversationId, senderId, text } }),
      prisma.conversation.update({ where: { id: conversationId }, data: { lastMessageAt: new Date() } }),
      // Si la otra persona lo había archivado o eliminado, le vuelve a aparecer
      prisma.conversationParticipant.updateMany({
        where: { conversationId, userId: { not: senderId } },
        data: { archived: false, deleted: false },
      }),
      // Quien escribe ya leyó todo lo anterior
      prisma.conversationParticipant.update({
        where: { conversationId_userId: { conversationId, userId: senderId } },
        data: { lastReadAt: new Date(), deleted: false },
      }),
    ]);

    return message;
  }

  async updateParticipant(
    conversationId: number,
    userId: number,
    changes: Partial<Pick<ConversationParticipant, "lastReadAt" | "archived" | "deleted" | "clearedAt">>,
  ): Promise<void> {
    await prisma.conversationParticipant.update({
      where: { conversationId_userId: { conversationId, userId } },
      data: changes,
    });
  }
}

// La fecha más reciente entre dos (la segunda puede no existir)
function maxDate(a: Date, b: Date | null): Date {
  return b && b > a ? b : a;
}