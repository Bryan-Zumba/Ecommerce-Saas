import { Categoria, CategoriaRepository } from '../../domain/Categoria';

const STORAGE_KEY = 'categorias';

export class LocalstorageCategoriaRepository implements CategoriaRepository {
  private getAll(): Categoria[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const defaultCats: Categoria[] = [
        { id: 1, nombre: 'Bebidas' },
        { id: 2, nombre: 'Comida' },
        { id: 3, nombre: 'Snacks' },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCats));
      return defaultCats;
    }
    return JSON.parse(raw) as Categoria[];
  }

  async obtenerTodas(): Promise<Categoria[]> {
    return this.getAll();
  }

  async crear(categoria: Omit<Categoria, 'id'>): Promise<Categoria> {
    const todas = this.getAll();
    const nueva: Categoria = { id: Date.now(), ...categoria };
    const actualizadas = [...todas, nueva];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(actualizadas));
    return nueva;
  }

  async actualizar(id: number, cambios: Partial<Omit<Categoria, 'id'>>): Promise<Categoria> {
    const todas = this.getAll();
    const actualizadas = todas.map((c) => (c.id === id ? { ...c, ...cambios } : c));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(actualizadas));
    return actualizadas.find((c) => c.id === id)!;
  }

  async eliminar(id: number): Promise<void> {
    const filtradas = this.getAll().filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtradas));
  }
}
