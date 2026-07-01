import cloudinary from "./CloudinaryConfig";
import { UploadApiResponse } from "cloudinary";
import streamifier from 'streamifier';

export class CloudinaryService{

    //Método para subir una imagen a Cloudinary
    async subirImagen(file: Express.Multer.File, folder: string): Promise<UploadApiResponse> {
        
        return new Promise((resolve, reject) => {

            const uploadStream = cloudinary.uploader.upload_stream(
                { folder },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result!);
                }
            );
            streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
    }

    //Método para borrar una imagen de Cloudinary
    async borrarImagen(publicId: string): Promise<void> {
        await cloudinary.uploader.destroy(publicId);
    }
}