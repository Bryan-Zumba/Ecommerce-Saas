import { ServicesEmpresa } from "../../empresa/application/ServicesEmpresa";
import { IRepositoryItem } from "../domain/IRepositoryItem";
import { ServiceCategoria } from "./ServiceCategoria";
import { ItemInputDTO } from "../domain/ItemInputDTO";
import { Item } from "../domain/Item"
import { ItemUpdateDTO } from "../domain/ItemUpdateDTO";
import { Tipo_Item } from "@prisma/client";

export class ServiceItem {

    private repository: IRepositoryItem;
    private serviceEmpresa: ServicesEmpresa;
    private serviceCategoria: ServiceCategoria;

     constructor(repository:IRepositoryItem, serviceEmpresa:ServicesEmpresa,serviceCategoria:ServiceCategoria){
        this.repository=repository;
        this.serviceEmpresa=serviceEmpresa;
        this.serviceCategoria=serviceCategoria;
    }

    async crearItem(item:ItemInputDTO){
       
        if (!item.id_empresa) {
            throw new Error("La empresa es requerida");
        }

        if (!item.id_categoria) {
            throw new Error("La categoria es requerida");
        }

        if (!item.nombre){
            throw new Error ("Nombre del Items es requerido");
        }

        if (item.nombre.length >100){
            throw new Error ("Nombre no puede tener mas de 100 caracteres");
        }

        if (item.descripcion && item.descripcion.length > 500){
            throw new Error ("Descripcion no puede tener mas de 500 caracteres");
        }

        if (item.costo.lte(0)){
            throw new Error ("Costo no debe ser menor a 0");
        }

        if (item.precio.lte(0)){
            throw new Error ("Precio no debe ser menor a 0");
        }

        if (item.precio.lt(item.costo)){
            throw new Error ("Precio debe ser mayor al costo");
        }

        if (!item.tipo_item){
            throw new Error ("Tipo de item requerido");
        }

        if (!Object.values(Tipo_Item).includes(item.tipo_item as Tipo_Item)) {
        throw new Error("Tipo de Item no válido");
        }

        if (item.estado === undefined || item.estado === null) {
        throw new Error("Estado del item es requerido");
        }
        //VERIFICAR SI ES IMPORTANTE
        const existeItemPorNombre = await this.repository.existeItemPorNombre(item.nombre, item.id_empresa);
        if (existeItemPorNombre) {
            throw new Error("El item ya existe");
        } 
  
        const empresa = await this.serviceEmpresa.obtenerEmpresaPorId(item.id_empresa);
        if (!empresa){
            throw new Error ("Empresa no encontrada");
        }

        const categoria = await this.serviceCategoria.obtenerCategoriaId(item.id_categoria);
        if (!categoria){
            throw new Error ("Categoria no encontrada");
        }
        const itemCreado = await this.repository.crearItem(item);

        return itemCreado;
        }

    async obtenerItems(id_empresa:number):Promise<Item[]>{
        await this.serviceEmpresa.obtenerEmpresaPorId(id_empresa);

        const items = await this.repository.obtenerItems(id_empresa);
        return items;   
     } 

    async obtenerItemsPorCategoria(id_categoria: number): Promise<Item[]> {

        if (!id_categoria || id_categoria <= 0) {
            throw new Error("Id de categoría inválido");
        }

        const categoria = await this.serviceCategoria.obtenerCategoriaId(id_categoria);

        if (!categoria) {
            throw new Error("Categoría no encontrada");
        }

        const items = await this.repository.obtenerItemsPorCategoria(id_categoria);

        if (!items || items.length === 0) {
            throw new Error("No existen items en esta categoría");
        }

        return items;
}

     async obtenerItemPorId(id_item:number):Promise<Item|null>{
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
        if(!id_item || id_item <=0) {
            throw new Error("Id de item inválido");
        }  
        if(!item.nombre && item.nombre.trim().length>100){
            throw new Error("Nombre del Item no puede tener mas de 100 caracteres");
        }
        if(item.descripcion && item.descripcion.length>500){
            throw new Error("Descripcion del Item no puede tener mas de 500 caracteres");
        }
        if(item.costo && item.costo.lte(0)){
            throw new Error("Costo del Item inválido");
        }
        if(item.precio && item.precio.lte(0)){
            throw new Error("Precio del Item inválido");
        }
        
        if(item.precio && item.precio.lt(item.costo)){
            throw new Error("Precio del Item debe ser mayor al costo");
        }
        if(!item.tipo_item){
            throw new Error("Tipo de Item requerido");
        }
        if (!Object.values(Tipo_Item).includes(item.tipo_item as Tipo_Item)) {
            throw new Error("Tipo de Item no válido");
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
