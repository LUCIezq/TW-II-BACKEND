import Express from 'express';
import cors from 'cors';
import { ENV } from './config/env';
import { authRouter } from './modules/auth/auth.router';
import productosRouter from './modules/productos/productos.router';
import categoriasRouter from './modules/categorias/categoria.router';

const app = Express();

app.use(cors());
app.use(Express.json());

const URL_BASE = '/api';

app.use(`${URL_BASE}/auth`, authRouter);
app.use(`${URL_BASE}/productos`, productosRouter);
app.use(`${URL_BASE}/categorias`, categoriasRouter);

app.listen(ENV.PORT, () => {
    console.log(`Server running on port ${ENV.PORT}`);
});