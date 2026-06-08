import { Bodega } from '../../domain/Bodega';
import { BodegaRepository } from '../../domain/BodegaRepository';

const STORAGE_KEY = 'saas_bodega';

export class LocalstorageBodegaRepository implements BodegaRepository {

  private obtenerColeccion(): Bodega[] {
    const guardado = localStorage.getItem(STORAGE_KEY);
    if (!guardado) return [];
    try {
      return JSON.parse(guardado);
    } catch {
      return [];
    }
  }

  private guardarColeccion(bodegas: Bodega[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bodegas));
  }

  async obtener(id_empresa: number): Promise<Bodega | null> {
    const bodegas = this.obtenerColeccion();
    const bodega = bodegas.find((b) => b.id_empresa === id_empresa);
    return bodega || null;
  }

  async registrar(bodega: Omit<Bodega, 'id_bodega' | 'fecha_registro'>): Promise<Bodega> {
    const bodegas = this.obtenerColeccion();

    // Verificar que no exista ya una bodega para esta empresa
    const existente = bodegas.find((b) => b.id_empresa === bodega.id_empresa);
    if (existente) {
      throw new Error('Ya existe una bodega registrada para esta empresa.');
    }

    const nuevoId = bodegas.length > 0 ? Math.max(...bodegas.map((b) => b.id_bodega)) + 1 : 1;
    const nuevaBodega: Bodega = {
      ...bodega,
      id_bodega: nuevoId,
      fecha_registro: new Date().toISOString().split('T')[0],
    };

    bodegas.push(nuevaBodega);
    this.guardarColeccion(bodegas);
    return nuevaBodega;
  }

  async actualizar(id_empresa: number, datos: Partial<Omit<Bodega, 'id_bodega' | 'id_empresa'>>): Promise<Bodega> {
    const bodegas = this.obtenerColeccion();
    const indice = bodegas.findIndex((b) => b.id_empresa === id_empresa);

    if (indice === -1) {
      throw new Error('No se encontró la bodega para esta empresa.');
    }

    const bodegaActualizada = { ...bodegas[indice], ...datos };
    bodegas[indice] = bodegaActualizada;
    this.guardarColeccion(bodegas);
    return bodegaActualizada;
  }
}
