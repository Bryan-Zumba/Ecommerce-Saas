import { CLIENTES_PRUEBA } from "../data/clientes";

const STORAGE_KEY = "saas_customers";
const STORAGE_VERSION = "v2";
const VERSION_KEY = "saas_customers_version";

/**
 * Inicializa el LocalStorage con datos de prueba si es necesario.
 */
const inicializarAlmacenamiento = () => {
  const versionGuardada = localStorage.getItem(VERSION_KEY);
  if (versionGuardada !== STORAGE_VERSION) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(CLIENTES_PRUEBA));
    localStorage.setItem(VERSION_KEY, STORAGE_VERSION);
  }
};

export const servicioClientes = {
  /**
   * Obtiene todos los clientes
   */
  obtenerClientes: async () => {
    inicializarAlmacenamiento();
    return new Promise((resolve) => {
      setTimeout(() => {
        const datos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        resolve(datos);
      }, 500);
    });
  },

  /**
   * Busca un cliente por su ID (Cédula/RUC)
   */
  obtenerClientePorId: async (id) => {
    inicializarAlmacenamiento();
    return new Promise((resolve) => {
      setTimeout(() => {
        const datos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        resolve(datos.find((c) => c.id === id) || null);
      }, 300);
    });
  },

  /**
   * Registra un nuevo cliente
   */
  crearCliente: async (datosCliente) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const datos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

        if (datos.some(c => c.id === datosCliente.id)) {
          return reject(new Error("Ya existe un cliente con esta Cédula / RUC"));
        }

        const nuevosDatos = [...datos, datosCliente];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevosDatos));
        resolve(datosCliente);
      }, 500);
    });
  },

  /**
   * Actualiza la información de un cliente existente
   */
  actualizarCliente: async (id, datosActualizados) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let datos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        let itemActualizado = null;

        datos = datos.map((c) => {
          if (c.id === id) {
            itemActualizado = { ...c, ...datosActualizados, id };
            return itemActualizado;
          }
          return c;
        });

        localStorage.setItem(STORAGE_KEY, JSON.stringify(datos));
        resolve(itemActualizado);
      }, 500);
    });
  },

  /**
   * Elimina un cliente por su ID
   */
  eliminarCliente: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let datos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        datos = datos.filter((c) => c.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(datos));
        resolve({ success: true, id });
      }, 500);
    });
  }
};
