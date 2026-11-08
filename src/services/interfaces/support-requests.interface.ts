import { CreateSupportRequestRequestDTO, SupportRequestResponseDTO } from "../../dto/support-requests.dto";

export interface ISupportRequestsService {
  createSupportRequest(userId: number, data: CreateSupportRequestRequestDTO): Promise<SupportRequestResponseDTO>;
}