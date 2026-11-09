import { logger } from "../config/logger";
import { CardData, ChargeResult, IPaymentGateway } from "./interfaces/payment-gateway.interface";

// Tarjetas de prueba que el "banco" rechaza; cualquier otro número válido se aprueba
const DECLINED_CARDS: Record<string, string> = {
  "4000000000000002": "Tarjeta rechazada por el banco",
  "4000000000009995": "Fondos insuficientes",
};

// Pasarela de mentiras para la demo: no cobra nada ni sale a internet.
export class SimulatedPaymentGateway implements IPaymentGateway {
  async charge(card: CardData, amount: number): Promise<ChargeResult> {
    const reason = DECLINED_CARDS[card.number];

    if (reason) {
      return { approved: false, reason };
    }

    logger.info(`Pago simulado aprobado por $${amount}`);

    return { approved: true, brand: this.getBrand(card.number), last4: card.number.slice(-4) };
  }

  async refund(bookingId: number, amount: number): Promise<void> {
    logger.info(`Reembolso simulado de $${amount} (reserva ${bookingId})`);
  }

  // La marca se reconoce por los primeros dígitos
  private getBrand(number: string): string {
    if (/^4/.test(number)) return "Visa";
    if (/^(5[1-5]|2[2-7])/.test(number)) return "Mastercard";
    if (/^3[47]/.test(number)) return "American Express";

    return "Tarjeta";
  }
}