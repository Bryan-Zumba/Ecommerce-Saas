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

    async obtenerCategorias(id_empresa:number):Promise<Categoria[]>{
        await this.serviceEmpresa.obtenerEmpresaPorId(id_empresa);

        const categorias = await this.repository.obtenerCategorias(id_empresa);
        return categorias;
    }

    async obtenerCategoriaId(id_categoria:number):Promise<Categoria> {
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
        await this.serviceEmpresa.obtenerEmpresaPorId(categoria.id_empresa);

        if (!categoria.nombre?.trim()) {
            throw new Error("El nombre de categoría es requerido");
        }
        if (categoria.nombre.trim().length > 100) {
            throw new Error("El nombre de categoría debe tener menos de 100 caracteres");
        }
        if (categoria.descripcion && categoria.descripcion.length > 500) {
            throw new Error("La descripción de categoría debe tener menos de 500 caracteres");
        }

        // VALIDAR SI HAY CATEGORIAS DUPLICADAS
        categoria.nombre = categoria.nombre.trim();
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
        const categoriaActual = await this.obtenerCategoriaId(id_categoria);
        
        if(categoria.nombre && categoria.nombre.length >100){
            throw new Error("Nombre de categoría inválido, debe tener menos de 100 caracteres");
        }
        if(categoria.nombre && categoria.nombre.trim() !== categoriaActual.nombre.trim()){
            const existe = await this.repository.existeCategoriaPorNombre(categoria.nombre.trim(), categoriaActual.id_empresa);
            if(existe){
                throw new Error("Ya existe una categoría con ese nombre para esta empresa");
            }
        }
        if(categoria.descripcion && categoria.descripcion.length >500){
            throw new Error(" La descripción  debe tener menos de 500 caracteres");
        }
        if(categoria.nombre){
            categoria.nombre = categoria.nombre.trim();
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
       




