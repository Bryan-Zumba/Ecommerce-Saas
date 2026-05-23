import { apiClient } from "@/core/apiClient";

export interface Cliente {
  id: string; // Cédula en el frontend
  nombre: string;
  email: string;
  telefono: string;
}

// Estructura que retorna el Backend (Base de Datos / Prisma)
interface BackendCliente {
  id?: number;
  cedula: string;
  nombres: string;
  apellidos: string;
  email: string | null;
  telefono: string | null;
  created_at?: string;
}

// Mapeador de Backend a Frontend
const mapearClienteAFronte = (c: BackendCliente): Cliente => {
  return {
    id: c.cedula,
    nombre: `${c.nombres} ${c.apellidos}`.trim(),
    email: c.email || "",
    telefono: c.telefono || "",
  };
};

// Mapeador de Frontend a Backend
const mapearClienteABackend = (datosCliente: Cliente): Omit<BackendCliente, "id" | "created_at"> => {
  const partesNombre = datosCliente.nombre.trim().split(/\s+/);
  const nombres = partesNombre[0] || "";
  const apellidos = partesNombre.slice(1).join(" ") || "-";

  return {
    cedula: datosCliente.id,
    nombres,
    apellidos,
    email: datosCliente.email || null,
    telefono: datosCliente.telefono || null,
  };
};

export const servicioClientes = {
  obtenerClientes: async (): Promise<Cliente[]> => {
    const respuesta = await apiClient.get<BackendCliente[]>("/api/clientes");
    return respuesta.map(mapearClienteAFronte);
  },

  obtenerClientePorId: async (cedula: string): Promise<Cliente | null> => {
    try {
      const respuesta = await apiClient.get<BackendCliente>(`/api/clientes/${cedula}`);
      return respuesta ? mapearClienteAFronte(respuesta) : null;
    } catch {
      return null;
    }
  },

  crearCliente: async (datosCliente: Cliente): Promise<Cliente> => {
    const datosBackend = mapearClienteABackend(datosCliente);
    const respuesta = await apiClient.post<BackendCliente>("/api/clientes", datosBackend);
    return mapearClienteAFronte(respuesta);
  },

  actualizarCliente: async (cedula: string, datosActualizados: Partial<Cliente>): Promise<Cliente | null> => {
    let datosBackend: Partial<BackendCliente> = {};
    
    if (datosActualizados.nombre) {
      const partesNombre = datosActualizados.nombre.trim().split(/\s+/);
      datosBackend.nombres = partesNombre[0] || "";
      datosBackend.apellidos = partesNombre.slice(1).join(" ") || "-";
    }
    if (datosActualizados.email !== undefined) datosBackend.email = datosActualizados.email;
    if (datosActualizados.telefono !== undefined) datosBackend.telefono = datosActualizados.telefono;

    const respuesta = await apiClient.put<BackendCliente>(`/api/clientes/${cedula}`, datosBackend);
    return respuesta ? mapearClienteAFronte(respuesta) : null;
  },

  eliminarCliente: async (cedula: string): Promise<{ success: boolean; id: string }> => {
    await apiClient.delete(`/api/clientes/${cedula}`);
    return { success: true, id: cedula };
  }
};
