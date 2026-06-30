import { useState, useEffect } from 'react';
import { useAuth } from '../context/auth/AuthContext';
import { RolService } from '@/modules/usuarios/services/RolService';

// Caché en memoria: evita repetir las llamadas de API cada vez que
// un componente diferente llame a usePermisos() con el mismo rol.
const permisosCache: Record<number, string[]> = {};
const pendingRequests: Partial<Record<number, Promise<string[]>>> = {};

async function fetchPermisosPorRol(id_rol: number): Promise<string[]> {
  if (permisosCache[id_rol]) return permisosCache[id_rol];
  const pendingRequest = pendingRequests[id_rol];
  if (pendingRequest) return pendingRequest;

  const request = (async () => {
    try {
      const rolData = await RolService.obtenerRolId(id_rol);
      const nombreRol = rolData?.rol?.nombre;
      if (!nombreRol) return [];
      const permisosData = await RolService.obtenerPermisosRol(nombreRol);
      const permisos: string[] = permisosData?.permisos || [];
      permisosCache[id_rol] = permisos;
      return permisos;
    } finally {
      delete pendingRequests[id_rol];
    }
  })();

  pendingRequests[id_rol] = request;
  return request;
}

export const usePermisos = () => {
  const { usuario } = useAuth();
  const [permisos, setPermisos] = useState<string[]>([]);
  const [cargandoPermisos, setCargandoPermisos] = useState(false);

  useEffect(() => {
    if (!usuario) {
      setPermisos([]);
      return;
    }

    // Si ya está en caché, lo usamos directamente sin marcar cargando
    if (permisosCache[usuario.id_rol]) {
      setPermisos(permisosCache[usuario.id_rol]);
      return;
    }

    setCargandoPermisos(true);
    fetchPermisosPorRol(usuario.id_rol)
      .then((p) => setPermisos(p))
      .catch((err) => {
        console.error('Error cargando permisos:', err);
        setPermisos([]);
      })
      .finally(() => setCargandoPermisos(false));
  }, [usuario]);

  const tienePermiso = (permiso: string) => permisos.includes(permiso);

  return { permisos, cargandoPermisos, tienePermiso };
};
