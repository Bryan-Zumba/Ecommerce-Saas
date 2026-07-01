import { ServicesEmpresa } from "../../empresa/application/ServicesEmpresa";
import { IRepositoryItem } from "../domain/IRepositoryItem";
import { ServiceCategoria } from "./ServiceCategoria";
import { CloudinaryService } from "@/core/cloudinary/CloudinaryServices";
import { ItemInputDTO } from "../domain/ItemInputDTO";
import { Item } from "../domain/Item"
import { ItemUpdateDTO } from "../domain/ItemUpdateDTO";
import { Tipo_Item } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export class ServiceItem {

    private repository: IRepositoryItem;
    private serviceEmpresa: ServicesEmpresa;
    private serviceCategoria: ServiceCategoria;
    private cloudinaryService: CloudinaryService;

     constructor(repository:IRepositoryItem, serviceEmpresa:ServicesEmpresa,serviceCategoria:ServiceCategoria,cloudinaryService:CloudinaryService){
        this.repository=repository;
        this.serviceEmpresa=serviceEmpresa;
        this.serviceCategoria=serviceCategoria;
        this.cloudinaryService=cloudinaryService;
    }

    async crearItem(item:ItemInputDTO){
        
        if(!item.id_empresa){
            throw new Error("El item debe pertenecer a una empresa");
        }

        await this.serviceEmpresa.obtenerEmpresaPorId(item.id_empresa);
        
        if (!item.id_categoria) {
            throw new Error("El item debe pertenecer a una categoria");
        }
        if(isNaN(Number(item.id_categoria))){
            throw new Error("Id de categoria inválido");
        }
        
        await this.serviceCategoria.obtenerCategoriaId(Number(item.id_categoria));

        if (!item.nombre?.trim()){
            throw new Error ("Nombre del item es requerido");
        }
        const existeItemPorNombre = await this.repository.existeItemPorNombre(item.nombre, item.id_empresa);
        if (existeItemPorNombre) {
            throw new Error("Ya existe un item con el nombre: " + item.nombre);
        }
        if(item.costo === undefined || item.costo === null || item.costo === ""){
            throw new Error("Costo del item es requerido");
        }
        if(!item.precio){
            throw new Error("Precio del item es requerido");
        }
        const costoDecimal = new Decimal(String(item.costo).replace(",", "."));
        const precioDecimal = new Decimal(String(item.precio).replace(",", "."));
        
        if(costoDecimal.lte(new Decimal(0))){
            throw new Error("Costo de item debe ser decimal");
        }
        if (precioDecimal.lte(new Decimal(0))) {
            throw new Error("Precio de item debe ser decimal");
        }
        if (precioDecimal.lt(costoDecimal)) {
            throw new Error("Precio debe ser mayor al costo");
        }
        if (!item.tipo_item){
            throw new Error ("Tipo de item requerido");
        }

        //Validaciones de longitud
        if (item.nombre.length >100){
            throw new Error ("Nombre no puede tener mas de 100 caracteres");
        }
        if (item.descripcion && item.descripcion.length > 500){
            throw new Error ("Descripcion no puede tener mas de 500 caracteres");
        }

        if (!Object.values(Tipo_Item).includes(item.tipo_item as Tipo_Item)) {
        throw new Error("Tipo de Item no válido");
        }

        //si adjuntan imagen subir a cloudinary
        if (item.file){
            const resultCloudinary= await this.cloudinaryService.subirImagen(
                item.file,
                `empresa_${item.id_empresa}/items`
            )
            item.imagen_url= resultCloudinary.secure_url;
            item.imagen_public_id=resultCloudinary.public_id;
            delete item.file;
        }
        
        if (item.imagen_url && item.imagen_url.length > 500){
            throw new Error ("Imagen url no puede tener mas de 500 caracteres");
        }
        if(item.imagen_public_id && item.imagen_public_id.length > 500){
            throw new Error ("Imagen public id no puede tener mas de 500 caracteres");
        }
        //const itemCreado = await this.repository.crearItem(item);

        //return itemCreado;
    }

    async obtenerItems(id_empresa:number):Promise<Item[]>{
        await this.serviceEmpresa.obtenerEmpresaPorId(id_empresa);

        const items = await this.repository.obtenerItems(id_empresa);
        return items;   
     } 

    async obtenerItemsPorCategoria(id_categoria: number): Promise<Item[]> {

        await this.serviceCategoria.obtenerCategoriaId(id_categoria);

        const items = await this.repository.obtenerItemsPorCategoria(id_categoria);

        if (!items || items.length === 0) {
            throw new Error("No existen items en esta categoría");
        }

        return items;
    }

    async obtenerItemPorId(id_item:number):Promise<Item>{
        if(!id_item || id_item <=0) {
            throw new Error("Id de item inválido");
        }  
        const item = await this.repository.obtenerItemPorId(id_item);
        if (!item){
            throw new Error ("Item no encontrado");
        }
        return item; 
     } 

     async actualizarItem(id_item:number,item:ItemUpdateDTO){

        const itemActual= await this.obtenerItemPorId(id_item);

        const costoFinal = item.costo ?? itemActual.costo;
        const precioFinal = item.precio ?? itemActual.precio;
        
        if(item.nombre && item.nombre.trim().length>100){
            throw new Error("Nombre del item no puede excederse de los 100 caracteres");
        }
        if(item.nombre && item.nombre.trim() !== itemActual.nombre.trim()){
            const existeItemPorNombre = await this.repository.existeItemPorNombre(item.nombre, itemActual.id_empresa, id_item);
            if (existeItemPorNombre) {
                throw new Error("Ya existe un item con el nombre: " + item.nombre);
            }
        }
        if(item.descripcion && item.descripcion.length>500){
            throw new Error("Descripcion del item no puede excederse de los 500 caracteres");
        }
        
        if(item.file){
            const resultCloudinary= await this.cloudinaryService.subirImagen(
                item.file,
                `empresa_${itemActual.id_empresa}/items`
            )
            if(itemActual.imagen_public_id){
                await this.cloudinaryService.borrarImagen(itemActual.imagen_public_id);
            }

            item.imagen_url= resultCloudinary.secure_url;
            item.imagen_public_id=resultCloudinary.public_id;
            delete item.file;
        }
        if (item.imagen_url && item.imagen_url.length > 500) {
            throw new Error("Imagen url no puede tener mas de 500 caracteres");
        }
        if(item.imagen_public_id && item.imagen_public_id.length>500){
            throw new Error("Imagen public id no puede excederse de los 500 caracteres");
        }

        if(costoFinal.lte(0)){
            throw new Error("Costo del item debe ser mayor a 0");
        }
        if(precioFinal.lte(0)){
            throw new Error("Precio del item debe ser mayor a 0");
        }
        
        if(precioFinal.lt(costoFinal)){
            throw new Error("Precio del item debe ser mayor al costo");
        }

        if(item.tipo_item && !Object.values(Tipo_Item).includes(item.tipo_item as Tipo_Item)) {
            throw new Error("Tipo de Item no válido");
        }

        if(item.id_categoria){
            const categoria = await this.serviceCategoria.obtenerCategoriaId(item.id_categoria);
            if(categoria.id_empresa !== itemActual.id_empresa) {
                throw new Error("La categoria no pertenece a la misma empresa");
            }
            if(categoria.estado == false) {
                throw new Error("La categoria no esta activa");
            }
        }

        const itemActualizado = await this.repository.actualizarItem(id_item,item);
        return itemActualizado; 
     }

     async desactivarItem(id_item:number):Promise<Item>{
        await this.obtenerItemPorId(id_item);
        const itemDesactivado = await this.repository.desactivarItem(id_item);
        return itemDesactivado; 
     }  

     async activarItem(id_item:number):Promise<Item>{
        await this.obtenerItemPorId(id_item);
        
        const itemActivado = await this.repository.activarItem(id_item);
        return itemActivado; 
     }  

    

    }
