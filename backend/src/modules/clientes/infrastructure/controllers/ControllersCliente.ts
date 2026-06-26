import { Request, Response } from "express";
import { ServiceCliente } from "../../application/ServicesCliente";

export class ControllerCliente{
    private service: ServiceCliente;

    constructor(service: ServiceCliente){
        this.service = service;
    }

    obtenerTodos=async(req:Request,res:Response)=>{
        try{
            const id_empresa = Number(req.params.id_empresa);
            const clientes = await this.service.obtenerTodos(id_empresa);
            return res.status(200).json({success:true,clientes});
        }catch(error:any){
            return res.status(400).json({success:false,message:error.message});
        }
    };

    obtenerClienteId=async(req:Request,res:Response)=>{
        try{
            const id_cliente = Number(req.params.id_cliente);
            const cliente = await this.service.obtenerClienteId(id_cliente);
            return res.status(200).json({success:true,cliente});
        }catch(error:any){
            return res.status(400).json({success:false,message:error.message});
        }
    };

    obtenerClienteCedula=async(req:Request,res:Response)=>{
        try{
            const id_empresa = Number(req.params.id_empresa);
            const cedula = req.params.cedula as string;
            const cliente = await this.service.obtenerClienteCedula(id_empresa, cedula);
            return res.status(200).json({success:true,cliente});
        }catch(error:any){
            return res.status(400).json({success:false,message:error.message});
        }
    };

    crearCliente=async(req:Request,res:Response)=>{
        try{
            const {id_empresa,cedula,nombres,apellidos,email,telefono,direccion} = req.body;
            const cliente = await this.service.crearCliente({
                id_empresa:Number(id_empresa),
                cedula,
                nombres,
                apellidos,
                email,
                telefono,
                direccion
            });
            return res.status(200).json({success:true,cliente});
        }catch(error:any){
            return res.status(400).json({success:false,message:error.message});
        }
    };

    actualizarInformacionCliente=async(req:Request,res:Response)=>{
        try{
            const id_cliente = Number(req.params.id_cliente);
            const {nombres,apellidos,email,telefono,direccion} = req.body;
            const cliente = await this.service.actualizarInformacionCliente(id_cliente,{
                nombres,
                apellidos,
                email,
                telefono,
                direccion
            });
            return res.status(200).json({success:true,cliente});
        }catch(error:any){
            return res.status(400).json({success:false,message:error.message});
        }
    };

    desactivarCliente=async(req:Request,res:Response)=>{
        try{
            const id_cliente = Number(req.params.id_cliente);
            const cliente = await this.service.desactivarCliente(id_cliente);
            return res.status(200).json({success:true,cliente});
        }catch(error:any){
            return res.status(400).json({success:false,message:error.message});
        }
    };

    activarCliente=async(req:Request,res:Response)=>{
        try{
            const id_cliente = Number(req.params.id_cliente);
            const cliente = await this.service.activarCliente(id_cliente);
            return res.status(200).json({success:true,cliente});
        }catch(error:any){
            return res.status(400).json({success:false,message:error.message});
        }
    };
}