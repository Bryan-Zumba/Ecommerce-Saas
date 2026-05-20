# 🚀 Conexión del Backend y Frontend: Crear y Listar Clientes

Esta guía contiene los pasos específicos para conectar el frontend (`web`) con el backend (`api`) únicamente para los flujos de **Crear** y **Listar** clientes, utilizando la arquitectura limpia existente.

---

## 🔌 Flujo de Conexión de Capas

El flujo de datos para listar y crear clientes viaja a través de las siguientes capas:

```
[Vista] Page_Clientes.tsx
   │
   ▼
[Hook] useClientesApi.ts
   │
   ▼
[Contrato] ClienteRepository.ts
   │
   ▼
[Implementación API] ApiClienteRepository.ts (Llama a /api/clientes)
   │
   ▼
[Backend] Express RoutesCliente.ts -> ControllerCliente.ts -> ServiceCliente.ts
   │
   ▼
[Base de Datos] RepositoryPrismaCliente.ts -> PostgreSQL (Prisma)
```

---

## 🛠️ Pasos de Configuración en el Frontend (`web`)

### 1. Configurar la URL de la API
El cliente HTTP (`apiClient.ts`) lee la dirección del backend de la variable de entorno `VITE_API_URL`.
* Crea o edita el archivo `.env` en la raíz de tu carpeta `web` y asegúrate de agregar esta línea:
  ```env
  VITE_API_URL=http://localhost:3001
  ```

---

### 2. Ajuste en `Page_Clientes.tsx` para evitar errores de compilación
Tu pantalla [Page_Clientes.tsx](file:///c:/Users/sayla/OneDrive/Project_tesis/Ecommerce-Saas/web/src/pages/Page_Clientes.tsx) actualmente intenta usar `actualizarCliente` y `eliminarCliente`. Como en esta fase solo nos enfocaremos en **Crear** y **Listar**, debemos adaptar la destructuración y declarar funciones temporales vacías para evitar errores de TypeScript.

Reemplaza la sección de inicialización del Hook en [Page_Clientes.tsx](file:///c:/Users/sayla/OneDrive/Project_tesis/Ecommerce-Saas/web/src/pages/Page_Clientes.tsx) (alrededor de la línea 20-22) con lo siguiente:

```typescript
// 1. Instanciamos el repositorio de la API limpia
const apiClienteRepository = new ApiClienteRepository();

function ClientesPage() {
  const navigate = useNavigate();

  // 2. Destructuramos únicamente las funciones de Listar y Crear
  const { clientes, cargando, agregarCliente } = useClientesApi(apiClienteRepository);

  // 3. Declaramos stubs temporales para no romper el compilador con editar/eliminar
  const actualizarCliente = async (id: string, datos: any) => {
    console.log("Actualización deshabilitada temporalmente");
    return { success: false };
  };

  const eliminarCliente = async (id: string) => {
    console.log("Eliminación deshabilitada temporalmente");
    return { success: false };
  };
```

---

## 🚀 Cómo Ejecutar y Probar

1. Abre tu terminal en la raíz del proyecto (`Ecommerce-Saas`).
2. Ejecuta el comando que levanta el backend y frontend en paralelo:
   ```bash
   npm run dev
   ```
3. Navega en tu navegador a `http://localhost:5173/clientes`.
4. Abre la consola del navegador (`F12`) y ve a la pestaña **Network (Red)**.
5. Haz clic en **"+ Nuevo Cliente"**, llena el formulario y guárdalo. Verás la petición HTTP `POST` exitosa viajando a `http://localhost:3001/api/clientes` y el nuevo cliente insertado en tu base de datos y en tu tabla en tiempo real.
