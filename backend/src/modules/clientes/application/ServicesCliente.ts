import { ServicesEmpresa } from "@/modules/empresa/application/ServicesEmpresa";
import { Cliente } from "../domain/Cliente";
import { ClienteInputDTO } from "../domain/ClienteInputDTO";
import { RepositoryCliente } from "../domain/IRepositoryCliente";
import { ClienteUpdateDTO } from "../domain/ClienteUpdateDTO";

export class ServiceCliente {
    private repository: RepositoryCliente;
    private serviceEmpresa: ServicesEmpresa;

    constructor(repository: RepositoryCliente, serviceEmpresa: ServicesEmpresa) {
        this.repository = repository;
        this.serviceEmpresa = serviceEmpresa;
    }

    async obtenerTodos(id_empresa: number): Promise<Cliente[]> {
        //validar que la empresa exista
        await this.serviceEmpresa.obtenerEmpresaPorId(id_empresa)
        
        const clientes = await this.repository.obtenerTodos(id_empresa);
        return clientes;
    }

    async obtenerClienteId(id_cliente: number): Promise<Cliente | null> {
        if(!id_cliente || id_cliente <= 0){
            throw new Error("El id del cliente es requerido");
        }
        //validar que el cliente exista
        const cliente = await this.repository.obtenerClienteId(id_cliente);
        if(!cliente){
            throw new Error("Cliente no encontrado");
        }
        return cliente;
    }

    async obtenerClienteCedula(id_empresa: number, cedula: string): Promise<Cliente | null> {
        if(!id_empresa || id_empresa <= 0){
            throw new Error("El id de la empresa es requerido");
        }
        //validar que la empresa exista
        await this.serviceEmpresa.obtenerEmpresaPorId(id_empresa)
        
        if (!cedula?.trim()) {
            throw new Error("La cedula del cliente es requerida");
        }
        const cliente = await this.repository.obtenerClienteCedula(id_empresa, cedula);
        return cliente;
    }

    async crearCliente(cliente: ClienteInputDTO) {
        if (!cliente.id_empresa) {
            throw new Error("El cliente debe pertenecer a una empresa");
        }
        if (!cliente.cedula?.trim()) {
            throw new Error("La cedula del cliente es requerida");
        }
        if (!cliente.nombres?.trim()) {
            throw new Error("El nombre del cliente es requerido");
        }
        if (!cliente.apellidos?.trim()) {
            throw new Error("El apellido del cliente es requerido");
        }

        const clienteEncontrado = await this.obtenerClienteCedula(cliente.id_empresa, cliente.cedula);
        if(clienteEncontrado){
            throw new Error("El cliente ya existe, no puede ser creado nuevamente");
        }

        if(cliente.email?.trim()){
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(!emailRegex.test(cliente.email)){
                throw new Error("Correo electronico no valido");
            }
        }

        //validar longitud de campos
        if(cliente.cedula && cliente.cedula.length > 20){
            throw new Error("La cedula debe tener menos de 20 caracteres");
        }
        if(cliente.nombres && cliente.nombres.length > 100){
            throw new Error("El nombre debe tener menos de 100 caracteres");
        }
        if(cliente.apellidos && cliente.apellidos.length > 100){
            throw new Error("El apellido debe tener menos de 100 caracteres");
        }
        if(cliente.email && cliente.email.length > 255){
            throw new Error("El correo electronico debe tener menos de 255 caracteres");
        }
        if(cliente.telefono && cliente.telefono.length > 20){
            throw new Error("El telefono debe tener menos de 20 caracteres");
        }
        if(cliente.direccion && cliente.direccion.length > 300){
            throw new Error("La direccion debe tener menos de 300 caracteres");
        }
        
        const data= await this.repository.crearCliente(cliente);
        return data;
    }

    async actualizarInformacionCliente(id_cliente: number, cliente: ClienteUpdateDTO): Promise<Cliente> {
        if(!id_cliente || id_cliente <= 0){
            throw new Error("El id del cliente es requerido");
        }
        await this.obtenerClienteId(id_cliente);

        //validar longitud de campos
        if(cliente.nombres && cliente.nombres.length > 100){
            throw new Error("El nombre debe tener menos de 100 caracteres");
        }
        if(cliente.apellidos && cliente.apellidos.length > 100){
            throw new Error("El apellido debe tener menos de 100 caracteres");
        }
        if(cliente.email && cliente.email.length > 255){
            throw new Error("El correo electronico debe tener menos de 255 caracteres");
        }
        if(cliente.email?.trim()){
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(!emailRegex.test(cliente.email)){
                throw new Error("Correo electronico no valido");
            }
        }
        if(cliente.telefono && cliente.telefono.length > 20){
            throw new Error("El telefono debe tener menos de 20 caracteres");
        }
        if(cliente.direccion && cliente.direccion.length > 300){
            throw new Error("La direccion debe tener menos de 300 caracteres");
        }
        const clienteActualizado = await this.repository.actualizarInformacionCliente(id_cliente, cliente);
        return clienteActualizado;
    }

    async desactivarCliente(id_cliente: number): Promise<Cliente> {
        await this.obtenerClienteId(id_cliente);

        const clienteDesactivado = await this.repository.desactivarCliente(id_cliente);
        return clienteDesactivado;
    }

    async activarCliente(id_cliente: number): Promise<Cliente> {
        await this.obtenerClienteId(id_cliente);

        const clienteActivado = await this.repository.activarCliente(id_cliente);
        return clienteActivado;
    }
}