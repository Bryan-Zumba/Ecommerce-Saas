import { Request, Response } from "express";
import { ServicesInventario } from "../../application/ServicesInventario";

export class ControllersInventario{
    private service: ServicesInventario

    constructor(service:ServicesInventario){
        this.service= service;
    }

    async obtenerInventarioBodega(req:Request,res:Response){
        try {
            const id_bodega = Number(req.params.id_bodega);
            const id_empresa = Number(req.user?.id_empresa);
            const data=await this.service.obtenerInventarioBodega(id_empresa);

            return res.status(200).json({success:true,data});
        } catch (error:any) {
            return res.status(400).json({success:false,message:error.message});
        }
    }
}