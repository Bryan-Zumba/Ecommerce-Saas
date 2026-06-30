import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../../../../core/database/prisma";

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const token = req.cookies?.access_token;
        if(!token){
            return res.status(401).json({ message: "Token no proporcionado" });
        }
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as {id_usuario: number, id_empresa: number, id_rol: number};
        
        const usuario = await prisma.usuario.findUnique({
            where: { id_usuario: payload.id_usuario },
            select: { estado: true }
        });

        if (!usuario || !usuario.estado) {
            return res.status(401).json({ message: "Usuario inactivo o no existe" });
        }

        req.user= payload;
        next();
    }catch(error){
        return res.status(401).json({ message: "Token invalido" });
    }
}

export default authMiddleware;