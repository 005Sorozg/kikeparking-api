import { Router } from "express";
import { container } from "../../config/container";
import { ConversationsController } from "../../controllers/conversations.controller";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware";

const router = Router();

// Todas las rutas de chats exigen sesión
router.use(requireAuth);

// El conductor abre un chat con el dueño de un parqueadero (o vuelve al que ya existe)
router.post("/", requireRole("conductor"), async (req, res) => {
  const controller = container.resolve<ConversationsController>("conversationsController");

  return controller.startConversation(req, res);
});

// Chats del usuario (?archived=true para los archivados)
router.get("/", async (req, res) => {
  const controller = container.resolve<ConversationsController>("conversationsController");

  return controller.getConversations(req, res);
});

// Total de mensajes sin leer (para el número rojo de la pestaña Mensajes)
router.get("/unread-count", async (req, res) => {
  const controller = container.resolve<ConversationsController>("conversationsController");

  return controller.getUnreadCount(req, res);
});

// Mensajes de un chat (?after=id para traer solo los nuevos)
router.get("/:id/messages", async (req, res) => {
  const controller = container.resolve<ConversationsController>("conversationsController");

  return controller.getMessages(req, res);
});

// Enviar un mensaje
router.post("/:id/messages", async (req, res) => {
  const controller = container.resolve<ConversationsController>("conversationsController");

  return controller.sendMessage(req, res);
});

// Archivar o desarchivar (solo para quien lo hace)
router.patch("/:id", async (req, res) => {
  const controller = container.resolve<ConversationsController>("conversationsController");

  return controller.updateConversation(req, res);
});

// Eliminar para mí (la otra persona conserva el chat)
router.delete("/:id", async (req, res) => {
  const controller = container.resolve<ConversationsController>("conversationsController");

  return controller.deleteConversation(req, res);
});

export default router;