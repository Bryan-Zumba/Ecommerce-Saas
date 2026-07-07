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

export type EstadoCompra = 'Pendiente' | 'Completada' | 'Cancelada';

export interface CompraEmpresa {
  id_compra: number;
  id_proveedor: number;
  id_usuario: number;
  id_empresa: number;
  id_periodo_contable: number;
  codigo_factura: string;
  imagen_url: string;
  imagen_public_id: string;
  total: number | string;
  fecha_compra: string;
  observacion?: string | null;
  estado_compra: EstadoCompra;
}

export interface DetalleCompra {
  id_detalle_compra: number;
  id_compra: number;
  id_bodega: number;
  id_item: number;
  cantidad: number;
  costo_unitario: number | string;
  subtotal: number | string;
  item?: {
    id_item: number;
    nombre: string;
  };
  bodega?: {
    id_bodega: number;
    nombre: string;
  };
}

export interface ComprasEmpresaResponse {
  success: boolean;
  message?: string;
  compras: CompraEmpresa[];
}

export interface DetalleCompraResponse {
  success: boolean;
  message?: string;
  detalleCompra: DetalleCompra[];
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

