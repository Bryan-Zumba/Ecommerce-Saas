const KEY_HISTORIAL = 'historial_operaciones';

export const servicioHistorial = {
  /**
   * Guarda una nueva operación en el historial (Venta o Solicitud de Stock)
   * @param {Object} operacion - Datos de la operación
   * @returns {Object} La operación guardada con ID y fecha
   */
  guardarOperacion: (operacion) => {
    try {
      const historial = JSON.parse(localStorage.getItem(KEY_HISTORIAL) || '[]');
      const nuevaOperacion = {
        ...operacion,
        idInterno: Date.now(), // ID para manejo interno del historial
        fechaRegistro: new Date().toISOString(),
      };
      
      historial.unshift(nuevaOperacion); // Añadir al inicio para que sea cronológico descendente
      localStorage.setItem(KEY_HISTORIAL, JSON.stringify(historial));
      return nuevaOperacion;
    } catch (error) {
      console.error("Error al guardar en el historial:", error);
      return null;
    }
  },

  /**
   * Obtiene todas las operaciones registradas
   */
  obtenerTodo: () => {
    try {
      return JSON.parse(localStorage.getItem(KEY_HISTORIAL) || '[]');
    } catch (error) {
      return [];
    }
  },

  /**
   * Filtra las ventas realizadas en el día de hoy
   */
  obtenerVentasDelDia: () => {
    try {
      const hoy = new Date().toLocaleDateString();
      const historial = JSON.parse(localStorage.getItem(KEY_HISTORIAL) || '[]');
      return historial.filter(op => 
        op.tipo === 'venta' && 
        new Date(op.fechaRegistro).toLocaleDateString() === hoy
      );
    } catch (error) {
      return [];
    }
  },

  /**
   * Obtiene solo las solicitudes de reposición de stock
   */
  obtenerSolicitudesStock: () => {
    try {
      const historial = JSON.parse(localStorage.getItem(KEY_HISTORIAL) || '[]');
      return historial.filter(op => op.tipo === 'stock');
    } catch (error) {
      return [];
    }
  },

  /**
   * Filtra las operaciones por criterios de búsqueda
   * @param {Object} filtros - { fecha, codigo }
   */
  filtrarOperaciones: (filtros) => {
    try {
      const historial = JSON.parse(localStorage.getItem(KEY_HISTORIAL) || '[]');
      return historial.filter(op => {
        let cumple = true;
        if (filtros.fecha) {
          const fechaOp = new Date(op.fechaRegistro).toLocaleDateString();
          const fechaFiltro = new Date(filtros.fecha).toLocaleDateString();
          if (fechaOp !== fechaFiltro) cumple = false;
        }
        if (filtros.codigo) {
          if (!op.ordenId.toString().toLowerCase().includes(filtros.codigo.toLowerCase())) cumple = false;
        }
        return cumple;
      });
    } catch (error) {
      return [];
    }
  }
};
