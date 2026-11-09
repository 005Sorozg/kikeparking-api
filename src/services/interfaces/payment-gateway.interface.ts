// Datos de la tarjeta ya validados (formato correcto y número que pasa Luhn)
export interface CardData {
  number: string;
  holderName: string;
}

// Respuesta del "banco": aprobado (con marca y últimos 4) o rechazado (con el motivo)
export type ChargeResult =
  | { approved: true; brand: string; last4: string }
  | { approved: false; reason: string };

// Pasarela de pagos. Hoy es simulada; para una real (Wompi, Stripe...) solo
// habría que hacer otra clase que cumpla esta interfaz y cambiarla en el container.
export interface IPaymentGateway {
  charge(card: CardData, amount: number): Promise<ChargeResult>;
  refund(bookingId: number, amount: number): Promise<void>;
}