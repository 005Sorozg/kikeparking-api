import { Request, Response } from "express";
import { env } from "../config/env";

export class HealthController {
  health = async (_req: Request, res: Response): Promise<void> => {
    res.status(200).json({
      status: true,
      serviceName: env.appName,
    });
  };
}