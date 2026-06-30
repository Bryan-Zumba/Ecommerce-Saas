import { apiClient } from "@/core/apiClient"
import type { ClienteResponse } from "../types/ClienteResponse";
import type { ClienteCreateDTO, ClienteUpdateDTO } from "../types/ClienteRequest";

export const ClienteService = {

    //METODO OBTENER CLIENTES POR EMPRESA
    obtenerClientesEmpresa(id_empresa: number): Promise<ClienteResponse> {
        return apiClient.get<ClienteResponse>(`/api/cliente/obtener-clientes/${id_empresa}`);
    },

    crearCliente(datos: ClienteCreateDTO): Promise<any> {
        return apiClient.post('/api/cliente/crear-cliente', datos);
    },

    actualizarInformacionCliente(id_cliente: number, datos: ClienteUpdateDTO): Promise<any> {
        return apiClient.put(`/api/cliente/actualizar-cliente/${id_cliente}`, datos);
    },

    desactivarCliente(id_cliente: number): Promise<any> {
        return apiClient.put(`/api/cliente/desactivar-cliente/${id_cliente}`, {});
    },

    activarCliente(id_cliente: number): Promise<any> {
        return apiClient.put(`/api/cliente/activar-cliente/${id_cliente}`, {});
    }
}