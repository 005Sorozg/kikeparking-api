import { SupportRequest } from "../../data/models/support-request.model";

export interface ISupportRequestsRepository {
  createSupportRequest(data: Omit<SupportRequest, "id" | "createdAt">): Promise<SupportRequest>;
}