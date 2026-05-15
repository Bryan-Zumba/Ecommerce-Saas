# SaaS Ecommerce Monorepo

Este proyecto utiliza una arquitectura de Monorepo gestionada con `concurrently`.

## Estructura del Proyecto

- `web/`: Aplicación Frontend construida con React + TypeScript + Vite.
- `api/`: API Backend construida con Node.js + Express + TypeScript.

## Requisitos

- Node.js (v18+)
- NPM

## Configuración

1. Instala las dependencias en la raíz:
   ```bash
   npm install
   ```

2. Instala las dependencias en cada subproyecto (opcional, el script raíz lo hace):
   ```bash
   npm install --prefix ./web
   npm install --prefix ./api
   ```

3. Configura el archivo `.env` en la carpeta `api/` basándote en `.env.example`.

## Ejecución

Para ejecutar tanto el frontend como el backend simultáneamente en modo desarrollo:

```bash
npm run dev
```

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:3001](http://localhost:3001)
