import { apiClient } from "@/core/apiClient"
import type { ClienteResponse } from "../types/ClienteResponse";

export const ClienteService = {

    //METODO OBTENER CLIENTES POR EMPRESA
    obtenerClientesEmpresa(id_empresa: number): Promise<ClienteResponse> {
        return apiClient.get<ClienteResponse>(`/api/clientes/obtener-clientes/${id_empresa}`);
    }
}