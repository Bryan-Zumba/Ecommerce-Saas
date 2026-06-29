import { ServiceCategoria } from "../../application/ServiceCategoria";
import { Request, Response } from "express";

export class ControllerCategoria {
    private service: ServiceCategoria;

    constructor(service: ServiceCategoria) {
        this.service = service;
    }

    obtenerCategorias = async (req: Request, res: Response) => {
        try {
            const id_empresa = Number(req.params.id_empresa);
            const categorias = await this.service.obtenerCategorias(id_empresa);
            return res.status(200).json({ success: true, categorias });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    };

    obtenerCategoriaId = async (req: Request, res: Response) => {
        try {
            const id_categoria = Number(req.params.id_categoria);
            const categoria = await this.service.obtenerCategoriaId(id_categoria);
            return res.status(200).json({ success: true, categoria });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    };

    crearCategoria = async (req: Request, res: Response) => {
        try {
            const { id_empresa, nombre, descripcion, estado } = req.body;
            const categoria = await this.service.crearCategoria({
                id_empresa: Number(id_empresa),
                nombre,
                descripcion,
                estado
            });
            return res.status(200).json({ success: true, categoria });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    };

    actualizarCategoria = async (req: Request, res: Response) => {
        try {
            const id_categoria = Number(req.params.id_categoria);
            const { nombre, descripcion, estado } = req.body;
            const categoria = await this.service.actualizarCategoria(id_categoria, {
                nombre,
                descripcion,
                estado
            });
            return res.status(200).json({ success: true, categoria });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    };

    desactivarCategoria = async (req: Request, res: Response) => {
        try {

            const id_categoria = Number(req.params.id_categoria);
            const categoria = await this.service.desactivarCategoria(id_categoria);
            return res.status(200).json({ success: true, categoria });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    };

    activarCategoria = async (req: Request, res: Response) => {
        try {
            const id_categoria = Number(req.params.id_categoria);
            const categoria = await this.service.activarCategoria(id_categoria);
            return res.status(200).json({ success: true, categoria });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    };
}