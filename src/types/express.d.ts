// Extiende el tipo Request de Express para incluir los datos del usuario autenticado
declare namespace Express {
  export interface Request {
    user?: {
      id: number;
      role: string;
    };
  }
}