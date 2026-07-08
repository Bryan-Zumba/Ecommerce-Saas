// Re-exportar tipos del inventario que necesitamos en ventas
import { InventarioDetalle } from '../../inventario/types/InventarioTypes';

// Cada item del catálogo de venta es un registro de inventario con su item y stock
export type ItemCatalogo = InventarioDetalle;
