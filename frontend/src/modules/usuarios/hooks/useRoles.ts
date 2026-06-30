import { useState, useEffect, useCallback } from 'react';
import { RolService } from '../services/RolService';
import { Rol } from '../types/RolesTypes';

export const useRoles = () => {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const cargarRoles = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const response = await RolService.obtenerRoles();
      // The API probably returns something like { roles: [...] } but if it's an array directly we handle it
      if (Array.isArray(response)) {
          setRoles(response);
      } else if (response && response.roles) {
          setRoles(response.roles);
      } else {
          setRoles(response as any);
      }
    } catch (err: any) {
      setError(err.message || 'Error al obtener los roles');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarRoles();
  }, [cargarRoles]);

  return {
    roles,
    cargando,
    error,
    refrescar: cargarRoles
  };
};
