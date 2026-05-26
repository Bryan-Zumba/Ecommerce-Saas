import { Bodega } from '../../domain/Bodega';
import { BodegaRepository } from '../../domain/BodegaRepository';

const DATOS_SEMILLA: Bodega[] = [
  {
    id_bodega: 1,
    id_empresa: 1,
    nombre: "Bodega Principal Guayaquil",
    descripcion: "Almacén central para la distribución a nivel nacional.",
    ubicacion: "Av. Carlos Julio Arosemena Km 3.5",
    estado: true,
    fecha_registro: "2026-01-10",
  },
  {
    id_bodega: 2,
    id_empresa: 1,
    nombre: "Sucursal Norte Quito",
    descripcion: "Bodega secundaria para despachos rápidos en la sierra.",
    ubicacion: "Av. 10 de Agosto y Orellana",
    estado: true,
    fecha_registro: "2026-02-15",
  },
  {
    id_bodega: 3,
    id_empresa: 1,
    nombre: "Centro Distribución Cuenca",
    descripcion: "Bodega pequeña y punto de retiro local.",
    ubicacion: "Calle Larga y Benigno Malo",
    estado: false,
    fecha_registro: "2026-04-01",
  }
];

export class LocalstorageBodegaRepository implements BodegaRepository {
  private key = 'saas_bodegas';

  private obtenerColeccion(): Bodega[] {
    const guardado = localStorage.getItem(this.key);
    if (!guardado) {
      localStorage.setItem(this.key, JSON.stringify(DATOS_SEMILLA));
      return DATOS_SEMILLA;
    }
    try {
      return JSON.parse(guardado);
    } catch {
      return DATOS_SEMILLA;
    }
  }

  private guardarColeccion(bodegas: Bodega[]): void {
    localStorage.setItem(this.key, JSON.stringify(bodegas));
  }

  async obtenerTodos(): Promise<Bodega[]> {
    return this.obtenerColeccion();
  }

  async crear(bodega: Omit<Bodega, 'id_bodega' | 'fecha_registro'>): Promise<Bodega> {
    const bodegas = this.obtenerColeccion();
    const nuevoId = bodegas.length > 0 ? Math.max(...bodegas.map(b => b.id_bodega)) + 1 : 1;
    const nuevaBodega: Bodega = {
      ...bodega,
      id_bodega: nuevoId,
      fecha_registro: new Date().toISOString().split('T')[0]
    };
    bodegas.unshift(nuevaBodega);
    this.guardarColeccion(bodegas);
    return nuevaBodega;
  }

  async actualizar(id: number, datosActualizados: Partial<Omit<Bodega, 'id_bodega'>>): Promise<Bodega> {
    const bodegas = this.obtenerColeccion();
    const indice = bodegas.findIndex(b => b.id_bodega === id);
    if (indice === -1) throw new Error('Bodega no encontrada');
    
    const bodegaActualizada = { ...bodegas[indice], ...datosActualizados };
    bodegas[indice] = bodegaActualizada;
    this.guardarColeccion(bodegas);
    return bodegaActualizada;
  }

  async eliminar(id: number): Promise<void> {
    const bodegas = this.obtenerColeccion();
    const filtradas = bodegas.filter(b => b.id_bodega !== id);
    this.guardarColeccion(filtradas);
  }

  async toggleEstado(id: number): Promise<Bodega> {
    const bodegas = this.obtenerColeccion();
    const indice = bodegas.findIndex(b => b.id_bodega === id);
    if (indice === -1) throw new Error('Bodega no encontrada');
    
    bodegas[indice].estado = !bodegas[indice].estado;
    this.guardarColeccion(bodegas);
    return bodegas[indice];
  }

  async restaurarDemo(): Promise<Bodega[]> {
    this.guardarColeccion(DATOS_SEMILLA);
    return DATOS_SEMILLA;
  }
}
