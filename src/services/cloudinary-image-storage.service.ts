import { cloudinary } from "../config/cloudinary";
import { IImageStorage, UploadedImage, UploadImageOptions } from "./interfaces/image-storage.interface";

export class CloudinaryImageStorage implements IImageStorage {
  upload(buffer: Buffer, options: UploadImageOptions): Promise<UploadedImage> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: options.folder,
          public_id: options.publicId,
          overwrite: true,
          invalidate: true,
          resource_type: "image",
          // Reduce el tamaño y comprime para que la app cargue rápido
          transformation: [
            { width: options.maxSize, height: options.maxSize, crop: "limit", quality: "auto" },
          ],
        },
        (error, result) => {
          if (error || !result) {
            reject(error ?? new Error("Cloudinary no devolvió resultado"));
            return;
          }

          resolve({ url: result.secure_url, publicId: result.public_id });
        },
      );

      stream.end(buffer);
    });
  }

  async delete(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId, { invalidate: true });
  }
}