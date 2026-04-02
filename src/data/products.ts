export interface Product {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  categoria: string;
  imagen?: string; // opcional
}

export const productsData: Product[] = [
  {
    id: 1,
    nombre: "Coca Cola",
    precio: 1.5,
    stock: 10,
    categoria: "Bebidas",
    imagen: "/assets/coca_cola_sin_azu_300ml.png"
  },
  {
    id: 2,
    nombre: "Hamburguesa",
    precio: 3.5,
    stock: 5,
    categoria: "Comida",
    imagen: "/assets/hamburguer.jpg"
  }
];