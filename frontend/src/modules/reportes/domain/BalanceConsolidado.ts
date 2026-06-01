import { ItemReporte } from './ItemReporte';
import { Egreso } from './Egreso';

export interface BalanceConsolidado {
  totalIngresos: number;         // Dinero Entrante total (ventas acumuladas)
  totalFacturas: number;         // Total compras de stock
  totalGastosExtras: number;     // Total gastos de insumos rápidos
  totalPagoPersonal: number;     // Total pago ayudante
  totalEgresos: number;          // Facturas + Gastos + Personal
  utilidadPeriodo: number;       // totalIngresos - totalEgresos
  pagoFiscalizacion: number;     // Deducción fija o variable por fiscalización
  dineroNetoCaja: number;        // utilidadPeriodo - pagoFiscalizacion
  valorMercaderiaPercha: number; // Sumatoria de costo de stock en percha
  items: ItemReporte[];
  egresos: Egreso[];
}
