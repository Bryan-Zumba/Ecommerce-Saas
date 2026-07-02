export interface Inventario {
    id_inventario: number,
    id_item: number,
    id_bodega: number,
    stock_actual: number,
    stock_disponible: number,
    stock_reservado: number,
    fecha_ultima_actualizacion: Date
}