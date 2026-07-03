import { ServicesEmpresa } from "../../empresa/application/ServicesEmpresa";
import { Compra } from "../domain/Compra";
import { CompraInputDTO } from "../domain/CompraInputDTO";
import { IRepositoryCompra } from "../domain/IRepositoryCompra";
import { normalizerDecimal } from "../../../shared/normalizerDecimal";
import { CloudinaryService } from "../../../core/cloudinary/CloudinaryServices";
import { DBClient } from "../../../core/database/DBClient";
import { Prisma } from "@prisma/client";
import { prisma } from "@/core/database/prisma";
import { ServicesDetalleCompra } from "./ServicesDetalleCompra";
import { SolicitudCompraDTO } from "../domain/SolicitudCompraDTO";

export class ServicesCompra{
    private repository: IRepositoryCompra;
    private serviceDetalleCompra: ServicesDetalleCompra;
    private serviceEmpresa: ServicesEmpresa;
    private cloudinaryService: CloudinaryService;

    constructor(repository: IRepositoryCompra, serviceDetalleCompra: ServicesDetalleCompra, serviceEmpresa: ServicesEmpresa, cloudinaryService: CloudinaryService){
        this.repository = repository;
        this.serviceDetalleCompra = serviceDetalleCompra;
        this.serviceEmpresa = serviceEmpresa;
        this.cloudinaryService = cloudinaryService;
    }

    //HU crear solicitud de ingreso de stock o compra de stock
    async crearSolicitudCompra(data: SolicitudCompraDTO){
        return await prisma.$transaction(async(tx: Prisma.TransactionClient)=>{
            let total = new Prisma.Decimal(0);

            for (const detalle of data.detalles){
                const subtotal = normalizerDecimal(detalle.costo_unitario, "Costo unitario").mul(detalle.cantidad);
                total = total.add(subtotal);
            }

            //Crear la compra
            // const compraCreada = await this.crearCompra({
            //     ...data,
            //     total: total
            // }, tx);

            const compraCreada = await this.crearCompra({
    id_proveedor: data.id_proveedor,
    id_usuario: data.id_usuario,
    id_empresa: data.id_empresa,
    id_periodo_contable: data.id_periodo_contable,
    codigo_factura: data.codigo_factura,
    observacion: data.observacion ?? null,
    file: data.file,
    imagen_url: "", // temporal (luego se sobreescribe)
    imagen_public_id: "", // temporal
    total
}, tx);

            //Crear los detalles de la compra
            for (const detalle of data.detalles) {

                await this.serviceDetalleCompra.crearDetalleCompra({
                    ...detalle, 
                    id_compra: compraCreada.id_compra
                }, tx);
            }
            
        })
    }

    private async crearCompra(compra: CompraInputDTO, client?: DBClient){

        if(!compra.id_proveedor){
            throw new Error("El id del proveedor es requerido");
        }

        await this.serviceEmpresa.obtenerEmpresaPorId(compra.id_empresa);

        //validar aqui api de periodo contable
        if(!compra.id_periodo_contable){
            throw new Error("El id del periodo contable es requerido");
        }
        if(!compra.codigo_factura){
            throw new Error("El codigo de factura es requerido");
        }
        if(!compra.file){
            throw new Error("Se requiere adjuntar la imagen de la factura");
        }
        const resultCloudinary = await this.cloudinaryService.subirImagen(
            compra.file,
            `empresa_${compra.id_empresa}/compras_facturas`
        )
        compra.imagen_url= resultCloudinary.secure_url;
        compra.imagen_public_id= resultCloudinary.public_id;
        delete compra.file;

        if (!compra.imagen_url || !compra.imagen_public_id) {
            throw new Error("No se pudo registrar la imagen de la factura.");
        }
        if (compra.imagen_url && compra.imagen_url.length > 500){
            throw new Error ("Imagen url no puede tener mas de 500 caracteres");
        }
        if(compra.imagen_public_id && compra.imagen_public_id.length > 500){
            throw new Error ("Imagen public id no puede tener mas de 500 caracteres");
        }


        //validacion longitud campos
        if(compra.codigo_factura.length > 50){
            throw new Error("El codigo de factura no puede tener mas de 50 caracteres");
        }

        if(compra.observacion && compra.observacion.length >500){
            throw new Error("La observacion no puede tener mas de 500 caracteres");
        }

        const compraCreada = await this.repository.crearCompra({
            ...compra
        }, client);
        return compraCreada;
    }
}