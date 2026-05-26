export interface Operacion {
  tipo: 'venta' | 'stock';
  ordenId?: string | number;
  bodegaId?: number | null;
  fecha?: string;
  fechaRegistro: string;
  productos: any[];
  total?: number;
  subtotal?: number;
  iva?: number;
  cliente?: any;
  datosFactura?: any;
  cajero?: string;
  estado?: string;
  idInterno?: number;
}

const KEY_HISTORIAL = 'historial_operaciones';

export const servicioHistorial = {
  guardarOperacion: (operacion: Omit<Operacion, 'idInterno' | 'fechaRegistro'>): Operacion | null => {
    try {
      const historial = JSON.parse(localStorage.getItem(KEY_HISTORIAL) || '[]');
      const nuevaOperacion: Operacion = {
        ...operacion,
        idInterno: Date.now(),
        fechaRegistro: new Date().toISOString(),
      };
      
      historial.unshift(nuevaOperacion);
      localStorage.setItem(KEY_HISTORIAL, JSON.stringify(historial));
      return nuevaOperacion;
    } catch (error) {
      console.error("Error al guardar en el historial:", error);
      return null;
    }
  },

  obtenerTodo: (): Operacion[] => {
    try {
      return JSON.parse(localStorage.getItem(KEY_HISTORIAL) || '[]');
    } catch (error) {
      return [];
    }
  },

  obtenerVentasDelDia: (): Operacion[] => {
    try {
      const hoy = new Date().toLocaleDateString();
      const historial: Operacion[] = JSON.parse(localStorage.getItem(KEY_HISTORIAL) || '[]');
      return historial.filter(op => 
        op.tipo === 'venta' && 
        new Date(op.fechaRegistro).toLocaleDateString() === hoy
      );
    } catch (error) {
      return [];
    }
  },

  obtenerSolicitudesStock: (): Operacion[] => {
    try {
      const historial: Operacion[] = JSON.parse(localStorage.getItem(KEY_HISTORIAL) || '[]');
      return historial.filter(op => op.tipo === 'stock');
    } catch (error) {
      return [];
    }
  },

  filtrarOperaciones: (filtros: { fecha?: string; codigo?: string }): Operacion[] => {
    try {
      const historial: Operacion[] = JSON.parse(localStorage.getItem(KEY_HISTORIAL) || '[]');
      return historial.filter(op => {
        let cumple = true;
        if (filtros.fecha) {
          const fechaOp = new Date(op.fechaRegistro).toLocaleDateString();
          const fechaFiltro = new Date(filtros.fecha).toLocaleDateString();
          if (fechaOp !== fechaFiltro) cumple = false;
        }
        if (filtros.codigo) {
          // If ordenId is missing, treat as non‑match
          if (!op.ordenId || !op.ordenId.toString().toLowerCase().includes(filtros.codigo.toLowerCase())) {
            cumple = false;
          }
        }
        return cumple;
      });
    } catch (error) {
      return [];
    }
  }
};
