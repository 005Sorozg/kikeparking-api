import { SupportRequest } from "../data/models/support-request.model";
import { prisma } from "../config/prisma";
import { ISupportRequestsRepository } from "./interfaces/support-requests.interface";

export class SupportRequestsRepository implements ISupportRequestsRepository {
  async createSupportRequest(data: Omit<SupportRequest, "id" | "createdAt">): Promise<SupportRequest> {
    return prisma.supportRequest.create({ data });
  }
}