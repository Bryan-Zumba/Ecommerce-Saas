import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import routerCliente from './modules/clientes/infrastructure/routes/RoutesCliente';
import routerAuth from './modules/auth/infrastructure/routes/RouteAuth';
import routerEmpresa from './modules/empresa/infrastructure/routes/RoutesEmpresa';
import routerRol from './modules/usuarios/infrastructure/routes/RoutesRol';
import routerUsuario from './modules/usuarios/infrastructure/routes/RoutesUsuario';
import routerBodega from './modules/inventario/infrastructure/routes/RoutesBodega';
import routerCategoria from './modules/inventario/infrastructure/routes/RouterCategoria';
import routerItem from './modules/inventario/infrastructure/routes/routerItem';
import routesInventario from './modules/inventario/infrastructure/routes/routesInventario';
import routesCompra from './modules/compra/infrastructure/routes/RoutesCompras';
import routerProveedor from './modules/proveedor/infrastructure/routes/RouterProveedor';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3010;

// Middlewares Globales
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.json({
    message: 'Backend Ecommerce API funcionando',
    health: '/health',
  });
});

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

//Rutas de aplicacion
app.use('/api/auth', routerAuth);
app.use('/api/empresa', routerEmpresa);
app.use('/api/rol', routerRol);
app.use('/api/usuario', routerUsuario);
app.use('/api/bodega', routerBodega);
app.use('/api/cliente', routerCliente);
app.use('/api/categoria', routerCategoria);
app.use('/api/item', routerItem);
app.use('/api/inventario', routesInventario);
app.use('/api/proveedor', routerProveedor);
app.use('/api/compra', routesCompra);

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});