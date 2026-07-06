import { Proveedor } from "../../proveedor/domain/Proveedor";
import { ProveedorInputDTO } from "../../proveedor/domain/ProveedorInputDTO";
import { ProveedorUpdateDTO } from "../../proveedor/domain/ProveedorUpdateDTO";

export interface IRepositoryProveedor {

    obtenerProveedores(id_empresa: number): Promise<Proveedor[]>;
    obtenerProveedorPorId(id_proveedor: number): Promise<Proveedor | null>;
    crearProveedor(proveedor: ProveedorInputDTO): Promise<Proveedor>;
    actualizarProveedor(id_proveedor: number, proveedor: ProveedorUpdateDTO): Promise<Proveedor>;
    activarProveedor(id_proveedor: number): Promise<Proveedor>;
    desactivarProveedor(id_proveedor: number): Promise<Proveedor>;
    existeProveedorPorNombre(nombre: string, id_empresa: number, id_proveedor?: number): Promise<boolean>;
}