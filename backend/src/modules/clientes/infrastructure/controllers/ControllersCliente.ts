import { Request, Response } from "express";
import { ServiceCliente } from "../../application/ServicesCliente";

export class ControllerCliente{
    private service: ServiceCliente;

    constructor(service: ServiceCliente){
        this.service = service;
    }

    obtenerClientes=async (req: Request, res: Response)=>{
      try{
            const id_empresa= parseInt(req.params.id_empresa as string);
            const clientes = await this.service.obtenerTodos(id_empresa);
            return res.status(200).json({success: true,clientes});
      }catch(error){
          return res.status(500).json({success:false,message:"Error al obtener los clientes"});
      }
    };
    // 2. Método para crear un nuevo cliente
    crearCliente = async (req: Request, res: Response) => {
        try {
            const { id_empresa, cedula, nombres, apellidos, email, telefono, direccion, estado } = req.body;
            
            // Validación simple
            if (!id_empresa || !cedula || !nombres || !apellidos) {
                return res.status(400).json({ message: "El id_empresa, cédula, nombres y apellidos son requeridos." });
            }

            const nuevoCliente = await this.service.crearCliente({
                id_empresa: Number(id_empresa),
                cedula,
                nombres,
                apellidos,
                email: email || null,
                telefono: telefono || null,
                direccion: direccion || null,
                estado: estado !== undefined ? Boolean(estado) : undefined
            });

            return res.status(201).json(nuevoCliente);
        } catch (error: any) {
            // Código de error de restricción de valor único en Prisma (P2002)
            if (error.code === 'P2002') {
                return res.status(400).json({ message: "Ya existe un cliente registrado con esta cédula." });
            }
            console.error("Error al registrar cliente: ", error);
            return res.status(500).json({ message: "Error interno al registrar el cliente" });
        }
    };

    actualizarCliente = async (req: Request, res: Response) => {
        try {
            const id_cliente = parseInt(req.params.id_cliente as string);
            if (isNaN(id_cliente)) {
                return res.status(400).json({ message: "El id_cliente debe ser un número válido." });
            }

            const { id_empresa, cedula, nombres, apellidos, email, telefono, direccion, estado } = req.body;

            if (!id_empresa || !cedula || !nombres || !apellidos) {
                return res.status(400).json({ message: "El id_empresa, cédula, nombres y apellidos son requeridos." });
            }

            const clienteActualizado = await this.service.actualizarCliente(id_cliente, {
                id_empresa: Number(id_empresa),
                cedula,
                nombres,
                apellidos,
                email: email || null,
                telefono: telefono || null,
                direccion: direccion || null,
                estado: estado !== undefined ? Boolean(estado) : undefined
            });

            return res.status(200).json({ success: true, cliente: clienteActualizado });
        } catch (error: any) {
            // Código de error de restricción de valor único en Prisma (P2002)
            if (error.code === 'P2002') {
                return res.status(400).json({ message: "Ya existe un cliente registrado con esta cédula." });
            }
            // Código de error de registro no encontrado en Prisma (P2025)
            if (error.code === 'P2025') {
                return res.status(404).json({ message: "El cliente no existe o no fue encontrado." });
            }
            console.error("Error al actualizar cliente: ", error);
            return res.status(500).json({ message: "Error interno al actualizar el cliente" });
        }
    };

    eliminarCliente = async (req: Request, res: Response) => {
        try {
            const id_cliente = parseInt(req.params.id_cliente as string);
            if (isNaN(id_cliente)) {
                return res.status(400).json({ message: "El id_cliente debe ser un número válido." });
            }
            const clienteEliminado = await this.service.eliminarCliente(id_cliente);
            return res.status(200).json({ success: true, cliente: clienteEliminado });
        } catch (error: any) {
            // Código de error de registro no encontrado en Prisma (P2025)
            if (error.code === 'P2025') {
                return res.status(404).json({ message: "El cliente no existe o no fue encontrado." });
            }
            console.error("Error al eliminar cliente: ", error);
            return res.status(500).json({ message: "Error interno al eliminar el cliente" });
        }
    };
}