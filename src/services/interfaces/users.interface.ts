import { LoginRequestDTO, LoginResponseDTO, RegisterUserRequestDTO, UserResponseDTO } from "../../dto/users.dto";

export interface IUsersService {
  registerUser(data: RegisterUserRequestDTO): Promise<UserResponseDTO>;
  login(data: LoginRequestDTO): Promise<LoginResponseDTO>;
}