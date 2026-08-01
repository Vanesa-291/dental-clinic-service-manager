import express from 'express';
import { engine } from 'express-handlebars';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import servicesRouter  from './routes/services.router.js';
import bookingsRouter  from './routes/bookings.router.js';
import messagesRouter  from './routes/messages.router.js';
import viewsRouter     from './routes/views.router.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

const app = express();

// ─── Handlebars ───────────────────────────────────────────────────────────
app.engine('handlebars', engine({
  layoutsDir:    join(__dirname, 'views/layouts'),
  defaultLayout: 'main',
}));
app.set('view engine', 'handlebars');
app.set('views', join(__dirname, 'views'));

// ─── Middlewares ──────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.static(join(__dirname, '../public')));

// ─── Rutas API REST ───────────────────────────────────────────────────────
app.use('/api/services', servicesRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/messages', messagesRouter);

// ─── Rutas de vistas ──────────────────────────────────────────────────────
app.use('/views', viewsRouter);

// ─── Ruta raíz ────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.redirect('/views/services');
});

// ─── Manejo de errores ────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({ error: 'Error interno del servidor.' });
});

export default app;
