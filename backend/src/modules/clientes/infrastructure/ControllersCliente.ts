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
    // 2. Método para crear un nuevo cliente
    crearCliente = async (req: Request, res: Response) => {
        try {
            const { cedula, nombres, apellidos, email, telefono } = req.body;
            
            // Validación simple
            if (!cedula || !nombres || !apellidos) {
                return res.status(400).json({ message: "La cédula, nombres y apellidos son requeridos." });
            }

            const nuevoCliente = await this.service.crear({
                cedula,
                nombres,
                apellidos,
                email: email || null,
                telefono: telefono || null,
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
 }