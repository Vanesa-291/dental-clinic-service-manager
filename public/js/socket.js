const socket = io();

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.style.display = 'block';
  setTimeout(() => { toast.style.display = 'none'; }, 4000);
}

// Evento: nuevo servicio creado (emitido por el servidor en POST /api/services)
socket.on('nuevo_servicio', (servicio) => {
  showToast(`✅ Nuevo servicio agregado: ${servicio.name}`);

  const lista = document.getElementById('listaServicios');
  if (!lista) return;

  const card = document.createElement('div');
  card.className = 'card card-available';
  card.innerHTML = `
    <div class="card-top">
      <h3 class="card-title">${servicio.name}</h3>
      <span class="badge badge-available">Disponible</span>
    </div>
    <p class="card-desc">${servicio.description}</p>
    <div class="card-meta">
      <span>⏱ ${servicio.duration} min</span>
      <span>💰 $${servicio.price}</span>
      <span>🏷 ${servicio.category}</span>
    </div>
  `;
  lista.prepend(card);
});

// Evento: nueva reserva creada (emitido por el servidor en POST /api/bookings)
socket.on('nueva_reserva', (reserva) => {
  showToast(`📅 Nueva reserva de ${reserva.clientName}`);

  const lista = document.getElementById('listaReservas');
  if (!lista) return;

  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <h3 class="card-title" style="margin-bottom:0.5rem;">${reserva.clientName}</h3>
    <p class="card-desc">${reserva.clientEmail}</p>
    <div class="card-meta" style="margin-bottom:0.5rem;">
      <span>📅 ${reserva.date}</span>
      <span>🕐 ${reserva.time}</span>
    </div>
    <span class="badge badge-status">${reserva.status}</span>
  `;
  lista.prepend(card);
});
