export interface Egreso {
  id: string;
  fecha: string;
  descripcion: string;
  monto: number;
  tipo: 'FacturaProveedor' | 'GastoExtra' | 'PagoPersonal';
}
