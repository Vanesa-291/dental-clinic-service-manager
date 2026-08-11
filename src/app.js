import express from 'express';
import { engine } from 'express-handlebars';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import servicesRouter  from './routes/services.router.js';
import bookingsRouter  from './routes/bookings.router.js';
import messagesRouter  from './routes/messages.router.js';
import viewsRouter     from './routes/views.router.js';
import { APP_NAME } from './config/env.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

const app = express();

// ─── Handlebars ───────────────────────────────────────────────────────────
app.engine('handlebars', engine({
  layoutsDir:    join(__dirname, 'views/layouts'),
  defaultLayout: 'main',
  // 🆕 helper para volcar datos como JSON dentro de un <script> (lo usa la
  // vista de reservas para pasarle el catálogo de servicios al cliente)
  helpers: {
    json: (context) => JSON.stringify(context),
  },
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
  res.status(200).json({
    mensaje: `🦷 ${APP_NAME}`,
    version: '9.0.0',
    endpoints: {
      services: {
        'GET    /api/services': 'Todos los servicios (?category=&available=&page=&limit=&sortBy=&order=)',
        'GET    /api/services/:sid': 'Servicio por ID',
        'POST   /api/services': 'Crear servicio',
        'PUT    /api/services/:sid': 'Actualizar servicio',
        'DELETE /api/services/:sid': 'Eliminar servicio',
      },
      bookings: {
        'GET    /api/bookings': 'Todas las reservas (con populate)',
        'POST   /api/bookings': 'Crear nueva reserva',
        'GET    /api/bookings/:bid': 'Reserva por ID (con populate)',
        'DELETE /api/bookings/:bid': 'Eliminar una reserva',
        'POST   /api/bookings/:bid/services/:sid': 'Agregar servicio a una reserva',
        'PUT    /api/bookings/:bid/services/:sid': 'Actualizar cantidad de un servicio en la reserva',
        'DELETE /api/bookings/:bid/services/:sid': 'Quitar un servicio de la reserva',
      },
    },
    vistas: {
      '/views/services': 'Catálogo de servicios',
      '/views/bookings': 'Gestión de reservas',
    },
  });
});

// ─── Manejo de errores ────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({ error: 'Error interno del servidor.' });
});

export default app;
