import { Categoria } from "./Categoria";
import { CategoriaInputDTO } from "./CategoriaInputDTO";
import { CategoriaUpdateDTO } from "./CategoriaUpdateDTO";

export interface RepositoryCategoria {
    obtenerCategorias(id_empresa:number):Promise<Categoria[]>
    obtenerCategoriaId(_categoria:number):Promise<Categoria | null>
    crearCategoria(data:CategoriaInputDTO):Promise<Categoria>
    actualizarCategoria(id_categoria:number,categoria:CategoriaUpdateDTO):Promise<Categoria>;
    desactivarCategoria(id_categoria:number):Promise<Categoria>;
    activarCategoria(id_categoria:number):Promise<Categoria>;
}
