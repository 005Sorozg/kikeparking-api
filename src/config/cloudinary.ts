import { v2 as cloudinary } from "cloudinary";
import { env } from "./env";

// Credenciales de la cuenta; el resto de la app usa este objeto ya configurado
cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
  secure: true,
});

export { cloudinary };