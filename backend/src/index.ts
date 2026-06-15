import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import routerCliente from './modules/clientes/infrastructure/RoutesCliente';
import routerAuth from './modules/auth/infrastructure/routes/RouteAuth';
import routerEmpresa from './modules/empresa/infrastructure/routes/RoutesEmpresa';
import routerRol from './modules/rol/infrastructure/routes/RoutesRol';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares Globales
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

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
app.use('/api/cliente', routerCliente);
app.use('/api/rol', routerRol);

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});
