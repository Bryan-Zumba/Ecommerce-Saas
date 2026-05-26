export interface Producto {
  id_productos: number;
  id_categoria: number;
  id_empresa: number;
  nombre: string;
  descripción: string; // Con tilde conforme a la especificación de BD
  precio: number;
  stock: number;
  estado: boolean;
  imagen?: string; // Opcional para mantener el diseño visual premium
}

export const EMPRESA = [
  { id: 1, nombre: 'Asociacion Turistica "Las Rocas"' }
];

export const CATEGORIAS = [
  { id: 1, nombre: 'Bebidas' },
  { id: 2, nombre: 'Comida' },
  { id: 3, nombre: 'Snacks' }
];

export const obtenerNombreCategoria = (id: number): string => {
  return CATEGORIAS.find(c => c.id === id)?.nombre || 'General';
};
