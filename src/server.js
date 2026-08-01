import './config/env.config.js';
import { PORT, NODE_ENV } from './config/env.config.js';
import { connectDB } from './config/db.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './app.js';

const httpServer = createServer(app);
const io = new Server(httpServer);

io.on('connection', (socket) => {
  console.log(`🔌 Cliente conectado: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`🔌 Cliente desconectado: ${socket.id}`);
  });
});

export { io };

try {
  await connectDB();

  httpServer.listen(PORT, () => {
    console.log('\n══════════════════════════════════════════════════════════');
    console.log('  🦷 DentalClinic API — Sistema de Turnos y Reservas');
    console.log(`  Entorno      : ${NODE_ENV}`);
    console.log(`  Servidor     : http://localhost:${PORT}`);
    console.log(`  Base de datos: MongoDB Atlas`);
    console.log(`  Arquitectura : Router → Controller → Service → Repository → DAO`);
    console.log('──────────────────────────────────────────────────────────');
    console.log('  VISTAS:');
    console.log(`  http://localhost:${PORT}/views/services`);
    console.log(`  http://localhost:${PORT}/views/bookings`);
    console.log('  API REST:');
    console.log(`  GET/POST  http://localhost:${PORT}/api/services  (?category=&available=&page=&limit=&sortBy=&order=)`);
    console.log(`  GET/POST  http://localhost:${PORT}/api/bookings`);
    console.log(`  GET/POST  http://localhost:${PORT}/api/messages`);
    console.log('══════════════════════════════════════════════════════════\n');
  });
} catch (error) {
  console.error('❌ Error al iniciar el servidor:', error.message);
  process.exit(1);
}
