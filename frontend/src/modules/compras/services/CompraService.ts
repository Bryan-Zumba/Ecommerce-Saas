import { apiClient } from '@/core/apiClient';
import {
  CompraResponse,
  ComprasEmpresaResponse,
  DetalleCompraResponse,
  SolicitudCompraRequest,
} from '../types/CompraTypes';

export const CompraService = {
  crearSolicitudCompra: async (data: SolicitudCompraRequest): Promise<CompraResponse> => {
    const formData = new FormData();

    formData.append('id_proveedor', String(data.id_proveedor));
    formData.append('codigo_factura', data.codigo_factura);

    if (data.observacion) {
      formData.append('observacion', data.observacion);
    }

    if (data.imagen) {
      formData.append('imagen', data.imagen);
    }

    // El backend parsea con JSON.parse(req.body.detalles)
    formData.append('detalles', JSON.stringify(data.detalles));

    return apiClient.post<CompraResponse>('/api/compra/crear-solicitud-compra', formData);
  },

  obtenerComprasEmpresa: async (): Promise<ComprasEmpresaResponse> => {
    return apiClient.get<ComprasEmpresaResponse>('/api/compra/obtener-compras-empresa');
  },

  obtenerDetalleCompra: async (id_compra: number): Promise<DetalleCompraResponse> => {
    return apiClient.get<DetalleCompraResponse>(`/api/detalle-compra/obtener-detalle-compra/${id_compra}`);
  },
};

