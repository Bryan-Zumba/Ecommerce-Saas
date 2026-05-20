# 🚀 Guía de Conexión del Backend y Frontend (Clientes)

Esta guía detalla el flujo de datos y los pasos necesarios para conectar de manera segura el backend (API) con el frontend (Web) utilizando la **Arquitectura Limpia** (Clean Architecture) implementada en tu proyecto.

---

## 📐 Estructura de Capas de la Arquitectura Limpia

Tanto en tu frontend (`web`) como en tu backend (`api`), la lógica está dividida bajo principios de Clean Architecture. A continuación se detalla cómo interactúa cada capa:

```mermaid
graph TD
  subgraph Frontend (web)
    UI[Page_Clientes.tsx] -->|React Hook| Hook[useClientesApi.ts]
    Hook -->|Contrato| RepoInt[ClienteRepository.ts]
    ApiRepo[ApiClienteRepository.ts] -.->|Implementa| RepoInt
    ApiRepo -->|Fetch| HTTP[apiClient.ts]
  end

  subgraph Backend (api)
    HTTP -->|Petición HTTP| Route[RoutesCliente.ts]
    Route -->|Controlador| Ctrl[ControllersCliente.ts]
    Ctrl -->|Caso de Uso| Serv[ServicesCliente.ts]
    Serv -->|Acceso a Datos| RepoPrisma[RepositoryPrismaCliente.ts]
    RepoPrisma -->|ORM| Prisma[(Base de Datos)]
  end
```

---

## 🛠️ Pasos para la Conexión y Funcionamiento

### 1. Configuración de Variables de Entorno en el Frontend
El `apiClient` del frontend utiliza la variable de entorno `VITE_API_URL` para saber a dónde apuntar las peticiones.
* Por defecto, si no está definida, apuntará a `http://localhost:3001` (que es el puerto por defecto de tu backend Express).
* Asegúrate de tener configurado tu archivo `.env` en la raíz de la carpeta `web` con lo siguiente:
  ```env
  VITE_API_URL=http://localhost:3001
  ```

### 2. Ejecutar la Aplicación en Modo de Desarrollo
Gracias al archivo `package.json` de la raíz del monorepo, puedes levantar el backend y el frontend simultáneamente con una sola terminal.
1. Abre tu terminal en la raíz del proyecto (`Ecommerce-Saas`).
2. Ejecuta el comando:
   ```bash
   npm run dev
   ```
   *Esto iniciará la base de datos (vía Prisma si es necesario), el servidor Express en `http://localhost:3001` y el frontend React en su puerto respectivo.*

---

## ⚠️ ¡Alerta Importante! Incompatibilidades en `Page_Clientes.tsx`

Al analizar minuciosamente tus archivos actuales, detectamos que si activas el backend con `useClientesApi` en `Page_Clientes.tsx`, **tendrás errores de compilación y ejecución**. Esto se debe a lo siguiente:

> [!WARNING]
> La vista `Page_Clientes.tsx` está intentando utilizar las funciones `actualizarCliente` y `eliminarCliente` (líneas 54 y 91), pero estas funciones **no están declaradas ni implementadas** en tu hook limpio `useClientesApi.ts` ni en tu `ApiClienteRepository.ts` de la arquitectura de la API.
>
> Tu backend en la carpeta `api` actualmente **solo tiene implementados los métodos para listar (`obtenerTodos`) y crear (`crear`)**.

---

## 🛠️ Cómo Extender la Conexión para Soportar "Actualizar" y "Eliminar"

Si deseas que la funcionalidad de modificar y borrar clientes funcione completamente conectada al backend, debes seguir los pasos a continuación para extender cada capa:

### Paso A: Extender el Backend (`api`)

#### 1. En el Repositorio de Dominio (`api/src/modules/clientes/domain/RepositoryCliente.ts`)
Añade los métodos en el contrato:
```typescript
export interface RepositoryCliente {
    obtenerTodos(): Promise<Cliente[]>;
    crear(cliente: Omit<Cliente, "id" | "created_at">): Promise<Cliente>;
    actualizar(id: number, cliente: Partial<Omit<Cliente, "id" | "created_at">>): Promise<Cliente | null>;
    eliminar(id: number): Promise<boolean>;
}
```

#### 2. En la Infraestructura de Prisma (`api/src/modules/clientes/infrastructure/RepositoryPrismaCliente.ts`)
Implementa las llamadas correspondientes en Prisma:
```typescript
async actualizar(id: number, cliente: Partial<Omit<Cliente, "id" | "created_at">>): Promise<Cliente | null> {
    return await prisma.cliente.update({
        where: { id },
        data: cliente
    });
}

async eliminar(id: number): Promise<boolean> {
    await prisma.cliente.delete({
        where: { id }
    });
    return true;
}
```

#### 3. En la Capa de Aplicación (`api/src/modules/clientes/application/ServicesCliente.ts`)
Agrega los servicios de caso de uso correspondientes:
```typescript
async actualizar(id: number, datos: Partial<Omit<Cliente, "id" | "created_at">>): Promise<Cliente | null> {
    return await this.repository.actualizar(id, datos);
}

async eliminar(id: number): Promise<boolean> {
    return await this.repository.eliminar(id);
}
```

#### 4. En el Controlador (`api/src/modules/clientes/infrastructure/ControllersCliente.ts`)
Crea los métodos para manejar las peticiones HTTP `PUT` y `DELETE`:
```typescript
actualizarCliente = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const nuevoCliente = await this.service.actualizar(Number(id), req.body);
        return res.status(200).json(nuevoCliente);
    } catch (error) {
        return res.status(500).json({ message: "Error al actualizar el cliente" });
    }
};

eliminarCliente = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await this.service.eliminar(Number(id));
        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ message: "Error al eliminar el cliente" });
    }
};
```

#### 5. En las Rutas (`api/src/modules/clientes/infrastructure/RoutesCliente.ts`)
Registra las nuevas rutas HTTP:
```typescript
routerCliente.put('/clientes/:id', controllerCliente.actualizarCliente);
routerCliente.delete('/clientes/:id', controllerCliente.eliminarCliente);
```

---

### Paso B: Extender el Frontend (`web`)

#### 1. En el Contrato de Dominio (`web/src/modules/clientes/domain/ClienteRepository.ts`)
Añade las firmas de los métodos:
```typescript
export interface ClienteRepository {
  obtenerTodos(): Promise<Cliente[]>;
  crear(cliente: Omit<Cliente, 'id' | 'created_at'>): Promise<Cliente>;
  actualizar(id: number, cliente: Partial<Omit<Cliente, 'id' | 'created_at'>>): Promise<Cliente>;
  eliminar(id: number): Promise<void>;
}
```

#### 2. En la Infraestructura del Repositorio de la API (`web/src/modules/clientes/infrastructure/ApiClienteRepository.ts`)
Llama a las rutas del backend a través de `apiClient`:
```typescript
async actualizar(id: number, cliente: Partial<Omit<Cliente, 'id' | 'created_at'>>): Promise<Cliente> {
  return apiClient.put<Cliente>(`/api/clientes/${id}`, cliente);
}

async eliminar(id: number): Promise<void> {
  return apiClient.delete<void>(`/api/clientes/${id}`);
}
```

#### 3. En tu Hook de React (`web/src/modules/clientes/application/useClientesApi.ts`)
Expón las funciones mapeando los datos de la interfaz visual (`ClienteUI`) al modelo que el repositorio y el backend esperan:
```typescript
// Agrega estas funciones dentro del hook useClientesApi:

const actualizarCliente = async (cedula: string, datosUI: Partial<ClienteUI>) => {
  setCargando(true);
  setError(null);
  try {
    // 1. Necesitas encontrar el ID numérico de base de datos de este cliente 
    // mapeando desde la UI o enviándolo en ClienteUI.
    // 2. Realizas la llamada al backend:
    // const actualizado = await repository.actualizar(idNumerico, datosProcesados);
    // 3. Actualizas el estado local de React
    return { success: true };
  } catch (err: any) {
    setError(err.message || 'Error al actualizar');
    return { success: false, error: err.message };
  } finally {
    setCargando(false);
  }
};

const eliminarCliente = async (cedula: string) => {
  setCargando(true);
  setError(null);
  try {
    // LLamada al backend
    // await repository.eliminar(idNumerico);
    // Filtrar estado
    return { success: true };
  } catch (err: any) {
    setError(err.message || 'Error al eliminar');
    return { success: false, error: err.message };
  } finally {
    setCargando(false);
  }
};
```

---

## 🎯 Resumen del Flujo de Conexión Actual

Si solo deseas probar la **creación** y la **lectura** de clientes tal y como están actualmente, el flujo ya está cableado:

1. **`Page_Clientes.tsx`** importa `ApiClienteRepository` y `useClientesApi`.
2. Instancia `new ApiClienteRepository()`.
3. Le pasa esta instancia a `useClientesApi(apiClienteRepository)`.
4. El Hook llama a `repository.obtenerTodos()` y `repository.crear()`.
5. El Repositorio realiza peticiones HTTP fetch via `/api/clientes` hacia tu backend local levantado en el puerto `3001`.
6. Tu backend Express intercepta la petición en `/api/clientes`, interactúa con Prisma para persistir/consultar la base de datos real, y devuelve el resultado en formato JSON.
