import { Request, Response } from "express";
import { ServicesRegister } from "../../application/services/ServicesRegister";

export class ControllerRegister{
    private service : ServicesRegister;

    constructor(service: ServicesRegister){
        this.service=service;
    }

    registrarTienda = async(req: Request, res: Response)=>{
        try {
            const data = await this.service.registrarTienda(req.body);
            return res.status(201).json({ success: true, message: "Tienda registrada exitosamente", data });
        } catch (error: any) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }
}