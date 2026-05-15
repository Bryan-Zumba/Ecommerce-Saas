import { CLIENTES_PRUEBA } from "./clientes.data";

export interface Cliente {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
}

const STORAGE_KEY = "saas_customers";
const STORAGE_VERSION = "v2";
const VERSION_KEY = "saas_customers_version";

const inicializarAlmacenamiento = () => {
  const versionGuardada = localStorage.getItem(VERSION_KEY);
  if (versionGuardada !== STORAGE_VERSION) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(CLIENTES_PRUEBA));
    localStorage.setItem(VERSION_KEY, STORAGE_VERSION);
  }
};

export const servicioClientes = {
  obtenerClientes: async (): Promise<Cliente[]> => {
    inicializarAlmacenamiento();
    return new Promise((resolve) => {
      setTimeout(() => {
        const datos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        resolve(datos);
      }, 500);
    });
  },

  obtenerClientePorId: async (id: string): Promise<Cliente | null> => {
    inicializarAlmacenamiento();
    return new Promise((resolve) => {
      setTimeout(() => {
        const datos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        resolve(datos.find((c: Cliente) => c.id === id) || null);
      }, 300);
    });
  },

  crearCliente: async (datosCliente: Cliente): Promise<Cliente> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const datos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

        if (datos.some((c: Cliente) => c.id === datosCliente.id)) {
          return reject(new Error("Ya existe un cliente con esta Cédula / RUC"));
        }

        const nuevosDatos = [...datos, datosCliente];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevosDatos));
        resolve(datosCliente);
      }, 500);
    });
  },

  actualizarCliente: async (id: string, datosActualizados: Partial<Cliente>): Promise<Cliente | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let datos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        let itemActualizado: Cliente | null = null;

        datos = datos.map((c: Cliente) => {
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

  eliminarCliente: async (id: string): Promise<{ success: boolean; id: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let datos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        datos = datos.filter((c: Cliente) => c.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(datos));
        resolve({ success: true, id });
      }, 500);
    });
  }
};
