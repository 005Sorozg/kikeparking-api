import { LoginRequestDTO, LoginResponseDTO, RegisterUserRequestDTO, UserResponseDTO } from "../../dto/users.dto";
import { UploadedFileData } from "./image-storage.interface";

export interface IUsersService {
  registerUser(data: RegisterUserRequestDTO): Promise<UserResponseDTO>;
  login(data: LoginRequestDTO): Promise<LoginResponseDTO>;
  getAllUsers(): Promise<UserResponseDTO[]>;
  updateAvatar(userId: number, file: UploadedFileData | undefined): Promise<UserResponseDTO>;
  removeAvatar(userId: number): Promise<UserResponseDTO>;
}