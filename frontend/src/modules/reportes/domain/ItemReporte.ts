export interface ItemReporte {
  id_item: number;
  nombre: string;
  ingresoTotal: number;          // Stock Inicial (saldo anterior) + Compras del periodo
  precioFactura: number;         // Costo unitario
  inversionReferencial: number;  // ingresoTotal * precioFactura
  pvp: number;                   // Precio venta público
  ventaUnidades: number;         // Ventas en el periodo
  totalVentaPvp: number;         // ventaUnidades * pvp (Ingreso bruto por producto)
  totalVentaFactura: number;     // ventaUnidades * precioFactura (Costo del producto vendido)
  utilidad: number;              // totalVentaPvp - totalVentaFactura
  usados: number;                // Mermas registradas por el supervisor
  perdidaMonto: number;          // usados * precioFactura
  percha: number;                // Stock restante real: ingresoTotal - ventaUnidades - usados
}
