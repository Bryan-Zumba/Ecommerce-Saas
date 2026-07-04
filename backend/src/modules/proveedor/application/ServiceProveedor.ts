import { ServicesEmpresa } from "@/modules/empresa/application/ServicesEmpresa";
import { IRepositoryProveedor } from "../domain/IRepositoryProveedor";
import { Proveedor } from "../domain/Proveedor";
import { ProveedorInputDTO } from "../domain/ProveedorInputDTO";
import { ProveedorUpdateDTO } from "../domain/ProveedorUpdateDTO";


export class ServiceProveedor {

    private repository: IRepositoryProveedor;
    private serviceEmpresa: ServicesEmpresa;

    constructor(repository: IRepositoryProveedor, serviceEmpresa: ServicesEmpresa) {
        this.repository = repository;
        this.serviceEmpresa = serviceEmpresa;
    }

    async crearProveedor(proveedor: ProveedorInputDTO){
        if(!proveedor.id_empresa){
            throw new Error("El proveedor debe pertenecer a una empresa");
        }
        if (!proveedor.nombre?.trim()) {
            throw new Error("El nombre del proveedor es requerido");
        }

        const existeProveedorPorNombre = await this.repository.existeProveedorPorNombre(proveedor.nombre,proveedor.id_empresa);
            if(existeProveedorPorNombre){
                throw new Error("Ya existe un proveedor con ese nombre");
        }
        if(proveedor.email?.trim()){
            const emailRegex =/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(!emailRegex.test(proveedor.email.trim())){
                throw new Error("El correo electronico no es valido");
            }
        }
        //Validacion de campos obligatorios
   
        if (proveedor.nombre && proveedor.nombre.length > 100){
            throw new Error("El nombre del proveedor no puede exceder los 100 caracteres");
        }
        if (proveedor.direccion && proveedor.direccion.length > 300){
            throw new Error("La dirección del proveedor no puede exceder los 300 caracteres");
        }
        //**IMPORTAR ARREGLAR PARA QUE SEAN SOLO LOS 10 DIGITOS DE UN NUMERO DE TELEFON  */
        if (proveedor.descripcion && proveedor.descripcion.length > 500){
            throw new Error("La descripción no puede exceder los 500 caracteres")
        }
        if (proveedor.telefono && proveedor.telefono.length > 20){
            throw new Error("El teléfono del proveedor no puede exceder los 20 caracteres");
        }
        if (proveedor.email && proveedor.email.length > 255){
            throw new Error("El email del proveedor no puede exceder los 255 caracteres");
        }

        const data = await this.repository.crearProveedor(proveedor);
        return data;
    } 

    async obtenerProveedores(id_empresa: number): Promise<Proveedor[]> {
        await this.serviceEmpresa.obtenerEmpresaPorId(id_empresa);
        
        const proveedores = await this.repository.obtenerProveedores(id_empresa);
        return proveedores;
    }

    async obtenerProveedorPorId(id_proveedor: number): Promise<Proveedor | null> {
        if(!id_proveedor || id_proveedor <=0){
            throw new Error("El id del proveedor es invalido");
        }
        const proveedor = await this.repository.obtenerProveedorPorId(id_proveedor);
        if (!proveedor) {
            throw new Error("El proveedor no existe");
        }
        return proveedor;
    }

    async actualizarProveedor(id_proveedor: number, proveedor: ProveedorUpdateDTO): Promise<Proveedor>{
        if(!id_proveedor || id_proveedor <=0){
            throw new Error("El id del proveedor es invalido");
        }
       const proveedorExiste= await this.obtenerProveedorPorId(id_proveedor);
        if(proveedor.nombre===null){
            throw new Error("No se puede eliminar el nombre del proveedor, debe actualizarlo por otro nombre");
        }
        if(proveedor.nombre){
            const existeProveedorPorNombre = await this.repository.existeProveedorPorNombre(proveedor.nombre,proveedorExiste!.id_empresa);
            if(existeProveedorPorNombre){
                throw new Error("Ya existe un proveedor con ese nombre");
            }
        }
        
        //validar logitud de camposs
        if (proveedor.nombre && proveedor.nombre.length > 100){
            throw new Error("El nombre del proveedor no puede exceder los 100 caracteres");
        }
        if (proveedor.direccion && proveedor.direccion.length > 300){
            throw new Error("La dirección del proveedor no puede exceder los 300 caracteres");
        }
        if (proveedor.descripcion && proveedor.descripcion.length > 500){
            throw new Error("La descripción no puede exceder los 500 caracteres")
        }
        if (proveedor.telefono && proveedor.telefono.length > 20){
            throw new Error("El teléfono del proveedor no puede exceder los 20 caracteres");
        }
        if (proveedor.email && proveedor.email.length > 255){
            throw new Error("El email del proveedor no puede exceder los 255 caracteres");
        }

        if(proveedor.email?.trim()){
            const emailRegex =/^[\s@]+@[\s@]+\.[\s@]+$/;
            if(!emailRegex.test(proveedor.email.trim())){
                throw new Error("El email del proveedor no es valido");
            }
        }

        const proveedorActualizado = await this.repository.actualizarProveedor(id_proveedor,proveedor);
        return proveedorActualizado;
    }

    async activarProveedor(id_proveedor: number): Promise<Proveedor>{
        await this.obtenerProveedorPorId(id_proveedor);
        
        const proveedorActivado = await this.repository.activarProveedor(id_proveedor);
        return proveedorActivado;
    }


    async desactivarProveedor(id_proveedor: number): Promise<Proveedor>{
        await this.obtenerProveedorPorId(id_proveedor);
        
        const proveedorDesactivado = await this.repository.desactivarProveedor(id_proveedor);
        return proveedorDesactivado;
    }
}