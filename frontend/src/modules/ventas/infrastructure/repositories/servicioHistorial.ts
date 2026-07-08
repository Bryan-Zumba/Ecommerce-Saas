export interface Operacion {
    id: string;
    fecha: string;
    tipo: string;
    total: number;
    productos: any[];
}

class ServicioHistorial {
    obtenerTodo() { return []; }
    obtenerVentasDelDia() { return []; }
    registrar(op: any) { }
}

export const servicioHistorial = new ServicioHistorial();
