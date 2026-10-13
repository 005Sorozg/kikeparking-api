// Error de negocio esperado: lleva un código estable y el status HTTP a responder
export class AppException extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode: number = 400,
  ) {
    super(message);
    // Necesario para que instanceof funcione correctamente al extender Error
    Object.setPrototypeOf(this, new.target.prototype);
  }
}