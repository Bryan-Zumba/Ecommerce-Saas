import { apiClient } from '../../../core/apiClient';
import { ItemResponse, ItemsListResponse, ItemInputDTO, ItemUpdateDTO } from '../types/ItemTypes';

export const ItemService = {
    // Obtener todos los items de la empresa activa
    obtenerItems: async (): Promise<ItemsListResponse> => {
        return apiClient.get<ItemsListResponse>('/api/item/obtener-items');
    },

    // Crear un nuevo item (usando FormData para soportar imágenes)
    crearItem: async (data: ItemInputDTO): Promise<ItemResponse> => {
        const formData = new FormData();
        
        formData.append('id_categoria', data.id_categoria.toString());
        formData.append('nombre', data.nombre);
        formData.append('costo', data.costo.toString());
        formData.append('precio', data.precio.toString());
        formData.append('tipo_item', data.tipo_item);
        
        if (data.descripcion) {
            formData.append('descripcion', data.descripcion);
        }
        
        if (data.file) {
            formData.append('imagen', data.file);
        }

        return apiClient.post<ItemResponse>('/api/item/crear-item', formData);
    },

    // Actualizar un item (usando FormData para soportar actualización de imagen)
    actualizarItem: async (id_item: number, data: ItemUpdateDTO): Promise<ItemResponse> => {
        const formData = new FormData();
        
        if (data.id_categoria !== undefined) formData.append('id_categoria', data.id_categoria.toString());
        if (data.nombre !== undefined) formData.append('nombre', data.nombre);
        if (data.descripcion !== undefined) formData.append('descripcion', data.descripcion ?? '');
        if (data.costo !== undefined) formData.append('costo', data.costo.toString());
        if (data.precio !== undefined) formData.append('precio', data.precio.toString());
        if (data.tipo_item !== undefined) formData.append('tipo_item', data.tipo_item);
        if (data.file) formData.append('imagen', data.file);

        return apiClient.put<ItemResponse>(`/api/item/actualizar-item/${id_item}`, formData);
    },

    // Desactivar un item
    desactivarItem: async (id_item: number): Promise<ItemResponse> => {
        return apiClient.put<ItemResponse>(`/api/item/desactivar-item/${id_item}`, {});
    },

    // Activar un item
    activarItem: async (id_item: number): Promise<ItemResponse> => {
        return apiClient.put<ItemResponse>(`/api/item/activar-item/${id_item}`, {});
    }
};
