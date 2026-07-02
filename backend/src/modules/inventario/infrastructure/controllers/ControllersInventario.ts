import { Request, Response } from "express";
import { ServicesInventario } from "../../application/ServicesInventario";

export class ControllersInventario{
    private service: ServicesInventario

    constructor(service:ServicesInventario){
        this.service= service;
    }

    obtenerInventarioBodega = async (req:Request,res:Response)=>{
        try {
            const id_empresa = Number(req.user?.id_empresa);
            
            if(!id_empresa){
                throw new Error("No autorizado para realizar esta accion")
            }

            const inventario=await this.service.obtenerInventarioBodega(id_empresa);

            return res.status(200).json({success:true, inventario});
        } catch (error:any) {
            return res.status(400).json({success:false,message:error.message});
        }
    }
}