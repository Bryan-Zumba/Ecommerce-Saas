export interface DetalleCompraInput {
  id_bodega: number;
  id_item: number;
  cantidad: number;
  costo_unitario: number;
}

export interface SolicitudCompraRequest {
  id_proveedor: number;
  codigo_factura: string;
  observacion?: string;
  imagen?: File | null;
  detalles: DetalleCompraInput[];
}

export interface CompraResponse {
  success: boolean;
  message?: string;
  compra?: {
    id_compra: number;
    codigo_factura: string;
    estado: string;
  };
}

// Fila editable en la tabla de detalle
export interface FilaDetalle {
  id_fila: string; // key local para React
  id_item: number | null;
  nombre_item: string;
  id_bodega: number | null;
  cantidad: number;
  costo_unitario: number;
}
