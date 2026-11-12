import { Request, Response } from "express";
import { IFavoritesService } from "../services/interfaces/favorites.interface";

export class FavoritesController {
  constructor(readonly favoritesService: IFavoritesService) { }

  getFavorites = async (req: Request, res: Response): Promise<void> => {
    const result = await this.favoritesService.getFavorites(req.user!.id);

    res.status(200).json(result);
  };

  addFavorite = async (req: Request, res: Response): Promise<void> => {
    await this.favoritesService.addFavorite(req.user!.id, Number(req.params.parkingSpotId));

    // 204: hecho, sin contenido que devolver
    res.status(204).send();
  };

  removeFavorite = async (req: Request, res: Response): Promise<void> => {
    await this.favoritesService.removeFavorite(req.user!.id, Number(req.params.parkingSpotId));

    res.status(204).send();
  };
}