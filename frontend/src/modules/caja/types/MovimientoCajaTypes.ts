export type TipoMovimientoCaja = 'Ingreso' | 'Egreso' | 'Apertura' | 'Cierre';

export interface VentaRelacionada {
  id_venta: number;
  total: number | string;
  fecha: string;
}

export interface CompraRelacionada {
  id_compra: number;
  total: number | string;
  fecha_compra: string;
  proveedor?: {
    id_proveedor: number;
    nombre: string;
  };
}

export interface EmpresaRelacionada {
  id_empresa: number;
  nombre: string;
}

export interface TurnoCajaRelacionado {
  usuario: {
    nombres: string;
    apellidos: string;
    email: string;
  };
  caja: {
    nombre: string;
    descripcion: string;
  };
}

export interface MovimientoCaja {
  id_movimiento_caja: number;
  id_turno_caja: number;
  id_venta: number | null;
  id_compra: number | null;
  id_empresa: number;
  tipo_movimiento: TipoMovimientoCaja;
  monto: number | string;
  referencia: string;
  fecha_movimiento: string;
  venta: VentaRelacionada | null;
  compra: CompraRelacionada | null;
  empresa: EmpresaRelacionada;
  turno_caja: TurnoCajaRelacionado;
}

export interface MovimientoCajaResponse {
  success: boolean;
  message?: string;
  movimientos?: MovimientoCaja[];
}
