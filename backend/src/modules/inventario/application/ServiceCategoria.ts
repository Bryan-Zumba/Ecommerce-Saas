import { ServicesEmpresa } from "@/modules/empresa/application/ServicesEmpresa";
import { Categoria } from "../domain/Categoria";
import { CategoriaInputDTO } from "../domain/CategoriaInputDTO";
import { CategoriaUpdateDTO } from "../domain/CategoriaUpdateDTO";
import { IRepositoryCategoria } from "../domain/IRepositoryCategoria";

export class ServiceCategoria {
    private repository: IRepositoryCategoria;
    private serviceEmpresa: ServicesEmpresa;

    constructor(repository: IRepositoryCategoria, serviceEmpresa: ServicesEmpresa) {
        this.repository = repository;
        this.serviceEmpresa = serviceEmpresa;
    }

        async obtenerCategoriaId(id_categoria:number):Promise<Categoria | null> {
        if(!id_categoria || id_categoria <=0 ){
            throw new Error("Id de categoría inválido");
        }
        const categoria = await this.repository.obtenerCategoriaId(id_categoria);
        if (!categoria) {
            throw new Error("Categoría no encontrada");
        }
        return categoria;
    }

    async crearCategoria(categoria: CategoriaInputDTO) {

        if (!categoria.id_empresa) {
            throw new Error("Empresa no encontrada");
        }

        if (!categoria.nombre?.trim()) {
            throw new Error("Nombre de categoría es requerido");
        }

        if (categoria.nombre.length > 30) {
            throw new Error("Nombre de categoría inválido, debe tener menos de 30 caracteres");
        }

        if (categoria.descripcion && categoria.descripcion.length > 200) {
            throw new Error("La descripción debe tener menos de 200 caracteres");
        }

        // VALIDAR SI HAY CATEGORIAS DUPLICADAS
        const existe = await this.repository.existeCategoriaPorNombre(
            categoria.nombre,
            categoria.id_empresa
        );

        if (existe) {
            throw new Error("Ya existe una categoría con ese nombre");
        }

        const data = await this.repository.crearCategoria(categoria);
        return data;
    }

    async actualizarCategoria(id_categoria:number,categoria:CategoriaUpdateDTO):Promise<Categoria> {
        if(!id_categoria || id_categoria <=0 ){
            throw new Error("Id de categoría es requerido");
        }
        if(categoria.nombre && categoria.nombre.length >30){
            throw new Error("Nombre de categoría inválido, debe tener menos de 30 caracteres");
        }   
        if(categoria.descripcion && categoria.descripcion.length >200){
            throw new Error(" La descripción  debe tener menos de 200 caracteres");
        }
        
        const categoriaActualizada = await this.repository.actualizarCategoria(id_categoria,categoria);
        return categoriaActualizada;
        }

    async desactivarCategoria(id_categoria:number):Promise<Categoria> {
        await this.obtenerCategoriaId(id_categoria);
                
        const categoriaDesactivada = await this.repository.desactivarCategoria(id_categoria);
        return categoriaDesactivada;
        
        }

    async activarCategoria(id_categoria:number):Promise<Categoria> {
        await this.obtenerCategoriaId(id_categoria);
            
        const categoriaActivada = await this.repository.activarCategoria(id_categoria);
           return categoriaActivada;                   
    }
            

} 
       




