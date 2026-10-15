import { PrismaClient } from "../generated/prisma/client";

// Una sola instancia compartida por toda la app
export const prisma = new PrismaClient();