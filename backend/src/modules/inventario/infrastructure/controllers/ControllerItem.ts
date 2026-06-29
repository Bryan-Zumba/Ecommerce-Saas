
import { ServiceItem } from "../../application/ServiceItem";
import { Request, Response } from "express";
import { Decimal } from "@prisma/client/runtime/library";
import { Tipo_Item } from "@prisma/client";



export class ControllerItem {
    private service: ServiceItem;

    constructor(service: ServiceItem) {
        this.service = service;
    }

    obtenerItems = async (req: Request, res: Response) => {
        try {
            const id_empresa = Number(req.params.id_empresa);
            const items = await this.service.obtenerItems(id_empresa);
            return res.status(200).json({ success: true, items });
        } catch (error: any) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }


    obtenerItemsPorCategoria = async (req: Request, res: Response) => {
        try {
            const id_categoria = Number(req.params.id_categoria);
            const items = await this.service.obtenerItemsPorCategoria(id_categoria);
            return res.status(200).json({ success: true, items });

        } catch (error: any) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    obtenerItemPorId = async (req: Request, res: Response) => {
        try {
            const id_item = Number(req.params.id_item);
            const item = await this.service.obtenerItemPorId(id_item);
            return res.status(200).json({ success: true, item });

        } catch (error: any) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    crearItem = async (req: Request, res: Response) => {
        try {
            const { id_empresa, id_categoria, nombre, descripcion, costo, precio, tipo_item, imagen_url, estado } = req.body;
            const item = await this.service.crearItem({
                id_empresa: Number(id_empresa),
                id_categoria: Number(id_categoria),
                nombre,
                descripcion,
                costo: new Decimal(costo),
                precio: new Decimal(precio),
                tipo_item,
                imagen_url,
                estado
            });
            return res.status(200).json({ success: true, item });

        } catch (error: any) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }
    //revisar si id:categoria tambien se puede actualizar
    actualizarItem = async (req: Request, res: Response) => {
        try {
            const id_item = Number(req.params.id_item);
            const { id_categoria, nombre, descripcion, costo, precio, tipo_item, imagen_url, estado } = req.body;
            const item = await this.service.actualizarItem(id_item, {
                id_categoria: Number(id_categoria),
                nombre,
                descripcion,
                costo: new Decimal(costo),
                precio: new Decimal(precio),
                tipo_item,
                imagen_url,
                estado
            });
            return res.status(200).json({ success: true, item });
        } catch (error: any) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    activarItem = async (req: Request, res: Response) => {
        try {
            const id_item = Number(req.params.id_item);
            const item = await this.service.activarItem(id_item);
            return res.status(200).json({ success: true, item });
        } catch (error: any) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    desactivarItem = async (req: Request, res: Response) => {
        try {
            const id_item = Number(req.params.id_item);
            const item = await this.service.desactivarItem(id_item);
            return res.status(200).json({ success: true, item });
        } catch (error: any) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }


}


