import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import routerCliente from './modules/clientes/infrastructure/RoutesCliente';

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
    clientes: '/api/clientes',
  });
});

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

//Rutas de aplicacion
app.use('/api',routerCliente);

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});
