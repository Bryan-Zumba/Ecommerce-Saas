import { ServiceProveedor } from "../../application/ServiceProveedor";
import { Request, Response } from "express";

export class ControllerProveedores {

    private service: ServiceProveedor;
    
    
    constructor(service: ServiceProveedor) {
        this.service = service;
    }

    obtenerProveedores = async (req:Request, res:Response) => {
        try{
            const id_empresa = Number(req.user?.id_empresa);
            const proveedores = await this.service.obtenerProveedores(id_empresa);
            return res.status(200).json({success:true, proveedores});
        }catch(error:any){
            res.status(400).json({success:false, message:error.message});
        }
    };
    
    
    obtenerProveedorPorId = async (req:Request, res:Response) => {
        try{
            const id_proveedor = Number(req.params?.id_proveedor);
            const proveedor = await this.service.obtenerProveedorPorId(id_proveedor);
            return res.status(200).json({success:true, proveedor});
        }catch(error:any){
            res.status(400).json({success:false, message:error.message});
        }
    };

    crearProveedor = async (req:Request, res:Response) => {
        try{
            const id_empresa = Number(req.user?.id_empresa);
            const {nombre,direccion,descripcion,telefono,email} = req.body;
            
            const proveedor = await this.service.crearProveedor({
                id_empresa,
                nombre,
                direccion,
                descripcion,
                telefono,
                email,
            });
            return res.status(200).json({success:true, proveedor});
        }catch(error:any){
            res.status(400).json({success:false, message:error.message});
        }
    };

    actualizarProveedor = async (req:Request, res:Response) => {
        try{
            const id_proveedor = Number(req.params.id_proveedor);
            const {nombre,direccion,descripcion,telefono,email} = req.body;
            const proveedor = await this.service.actualizarProveedor(id_proveedor,{
                nombre,
                direccion,
                descripcion,
                telefono,
                email,
            });
            return res.status(200).json({success:true, proveedor});
        }catch(error:any){
            res.status(400).json({success:false, message:error.message});
        }
    };

    desactivarProveedor = async (req:Request, res:Response)=>{
        try{
            const id_proveedor = Number(req.params.id_proveedor);
            const proveedor = await this.service.desactivarProveedor(id_proveedor);
            return res.status(200).json({success:true, proveedor});
        }catch(error:any){
            res.status(400).json({success:false, message:error.message});
        }
    };
    
    activarProveedor = async (req:Request, res:Response)=>{
        try{
            const id_proveedor = Number(req.params.id_proveedor);
            const proveedor = await this.service.activarProveedor(id_proveedor);
            return res.status(200).json({success:true, proveedor});
        }catch(error:any){
            res.status(400).json({success:false, message:error.message});
        }
    };
 }