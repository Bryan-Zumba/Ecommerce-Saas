import { Request, Response } from "express";
import { ServiceCliente } from "../application/ServicesCliente";

export class ControllerCliente{
    private service: ServiceCliente;

    constructor(service: ServiceCliente){
        this.service = service;
    }

    obtenerClientes=async (req: Request, res: Response)=>{
      try{
            const clientes = await this.service.obtenerTodos();
            return res.status(200).json(clientes);
      }catch(error){
          return res.status(500).json({message:"Error al obtener los clientes"});
      }
    };
}