import { Request, Response } from "express";
import { LoginRequestDTO, RegisterUserRequestDTO } from "../dto/users.dto";
import { IUsersService } from "../services/interfaces/users.interface";

export class UsersController {
  constructor(readonly usersService: IUsersService) {}

  register = async (req: Request, res: Response): Promise<void> => {
    // El servicio valida el cuerpo, porque el cliente puede mandar cualquier cosa
    const body = req.body as RegisterUserRequestDTO;

    const result = await this.usersService.registerUser(body);

    res.status(201).json(result);
  };

  login = async (req: Request, res: Response): Promise<void> => {
    const body = req.body as LoginRequestDTO;

    const result = await this.usersService.login(body);

    res.status(200).json(result);
  };

  getAll = async (req: Request, res: Response): Promise<void> => {
    const result = await this.usersService.getAllUsers();

    res.status(200).json(result);
  };
}