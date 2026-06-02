import { useState, useEffect, useCallback, useMemo } from 'react';
import { Categoria } from '../domain/Categoria';
import { CategoriaRepository } from '../domain/CategoriaRepository';

export const useCategorias = (repo: CategoriaRepository) => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const data = await repo.obtenerTodas();
      setCategorias(data);
    } catch (e: any) {
      setError(e.message ?? 'Error al cargar categorías');
    } finally {
      setCargando(false);
    }
  }, [repo]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const crear = async (datos: Omit<Categoria, 'id'>) => {
    const nueva = await repo.crear(datos);
    setCategorias(prev => [nueva, ...prev]);
  };

  const actualizar = async (id: number, datos: Partial<Omit<Categoria, 'id'>>) => {
    const actualizada = await repo.actualizar(id, datos);
    setCategorias(prev => prev.map(c => (c.id === id ? actualizada : c)));
  };

  const eliminar = async (id: number) => {
    await repo.eliminar(id);
    setCategorias(prev => prev.filter(c => c.id !== id));
  };

  return { categorias, cargando, error, crear, actualizar, eliminar, cargar };
};
