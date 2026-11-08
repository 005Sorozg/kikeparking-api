import { SupportRequest } from "../data/models/support-request.model";
import { CreateSupportRequestRequestDTO, SupportRequestResponseDTO } from "../dto/support-requests.dto";
import { AppException } from "../exceptions/app.exception";
import { AppErrors } from "../exceptions/errors/app.error";
import { ISupportRequestsRepository } from "../repositories/interfaces/support-requests.interface";
import { ISupportRequestsService } from "./interfaces/support-requests.interface";

export class SupportRequestsService implements ISupportRequestsService {
  constructor(readonly supportRequestsRepository: ISupportRequestsRepository) {}

  // Guarda un mensaje de ayuda del usuario que inició sesión
  async createSupportRequest(userId: number, data: CreateSupportRequestRequestDTO): Promise<SupportRequestResponseDTO> {
    const problems = this.validateData(data);

    if (problems.length > 0) {
      const error = AppErrors.SUPPORT_REQUEST_INVALID_DATA;

      throw new AppException(error.code, `${error.message}: ${problems.join(", ")}`, error.statusCode);
    }

    const request = await this.supportRequestsRepository.createSupportRequest({
      subject: data.subject.trim(),
      message: data.message.trim(),
      userId,
    });

    return this.toResponseDTO(request);
  }

  private validateData(data: CreateSupportRequestRequestDTO): string[] {
    const problems: string[] = [];

    const subject = typeof data?.subject === "string" ? data.subject.trim() : "";
    const message = typeof data?.message === "string" ? data.message.trim() : "";

    if (subject.length < 3 || subject.length > 100) {
      problems.push("subject debe tener entre 3 y 100 caracteres");
    }

    if (message.length < 10 || message.length > 1000) {
      problems.push("message debe tener entre 10 y 1000 caracteres");
    }

    return problems;
  }

  private toResponseDTO(request: SupportRequest): SupportRequestResponseDTO {
    return {
      id: request.id,
      subject: request.subject,
      message: request.message,
      createdAt: request.createdAt.toISOString(),
    };
  }
}