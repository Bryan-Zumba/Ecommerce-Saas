import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try{
        const token = req.cookies?.access_token;
        if(!token){
            return res.status(401).json({ message: "Token no proporcionado" });
        }
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as {id_usuario: number, id_empresa: number, id_rol: number};
        req.user= payload;
        next();
    }catch(error){
        return res.status(401).json({ message: "Token invalido" });
    }
}

export default authMiddleware;