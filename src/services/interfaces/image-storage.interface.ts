// Archivo ya recibido en memoria (lo entrega multer)
export interface UploadedFileData {
  buffer: Buffer;
  mimetype: string;
  size: number;
}

export interface UploadedImage {
  url: string;
  publicId: string;
}

export interface UploadImageOptions {
  folder: string;
  // Si se indica, subir otra imagen con el mismo id reemplaza la anterior
  publicId?: string;
  // Lado máximo en píxeles; la imagen se reduce si es más grande
  maxSize: number;
}

export interface IImageStorage {
  upload(buffer: Buffer, options: UploadImageOptions): Promise<UploadedImage>;
  delete(publicId: string): Promise<void>;
}