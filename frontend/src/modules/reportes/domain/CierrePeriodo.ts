export interface CierrePeriodo {
  id: string;
  fechaCierre: string;
  periodo: string; // Ej: "Enero 2026 - Febrero 2026"
  totalIngresos: number;
  totalEgresos: number;
  utilidad: number;
  pagoFiscalizacion: number;
  dineroNetoCaja: number;
  valorMercaderiaPercha: number;
  fotoInventario: {
    id_item: number;
    nombre: string;
    stockFinal: number;
    usados: number;
    perdidaMonto: number;
    distribucionBodegas?: {
      bodega: string;
      cantidad: number;
    }[];
  }[];
}
