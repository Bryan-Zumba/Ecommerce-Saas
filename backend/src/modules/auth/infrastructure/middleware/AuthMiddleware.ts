import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({ message: "Token no proporcionado" });
    }
    const token = authHeader.split(' ')[1];
    if(!token){
        return res.status(401).json({ message: "Token no proporcionado" });
    }
    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as {id_usuario: number, id_empresa: number, id_rol: number};
        req.user= payload;
        next();
    }catch(error){
        return res.status(401).json({ message: "Token invalido" });
    }
}

export default authMiddleware;