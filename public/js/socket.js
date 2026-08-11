const socket = io();

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.style.display = 'block';
  setTimeout(() => { toast.style.display = 'none'; }, 4000);
}

/* ══════════════════════════════════════════════════════════════════════
   SERVICIOS — construcción de tarjetas y escucha de eventos
   ══════════════════════════════════════════════════════════════════════ */

function buildServiceCardHTML(s) {
  const availClass = s.available ? 'card-available' : 'card-unavailable';
  const badgeClass = s.available ? 'badge-available' : 'badge-unavailable';
  const badgeText  = s.available ? 'Disponible' : 'No disponible';
  return `
    <div class="card ${availClass}" data-service-id="${s._id}">
      <div class="card-top">
        <h3 class="card-title">${s.name}</h3>
        <span class="badge ${badgeClass}">${badgeText}</span>
      </div>
      <p class="card-desc">${s.description}</p>
      <div class="card-meta">
        <span>⏱ ${s.duration} min</span>
        <span>💰 $${s.price}</span>
        <span>🏷 ${s.category}</span>
      </div>
      <div class="card-actions">
        <button type="button" onclick="toggleAvailability('${s._id}', ${s.available})">🔁 Disponibilidad</button>
        <button type="button" class="btn-danger" onclick="deleteService('${s._id}')">🗑 Eliminar</button>
      </div>
    </div>`;
}

// Se emite al crear un servicio (POST /api/services)
socket.on('nuevo_servicio', (s) => {
  showToast(`✅ Nuevo servicio agregado: ${s.name}`);
  const lista = document.getElementById('listaServicios');
  if (!lista) return;
  lista.insertAdjacentHTML('afterbegin', buildServiceCardHTML(s));
});

// Se emite al actualizar un servicio (PUT /api/services/:sid) — cubre
// también el caso de "cambiar disponibilidad"
socket.on('servicio_actualizado', (s) => {
  showToast(`✏️ Servicio actualizado: ${s.name}`);
  const card = document.querySelector(`[data-service-id="${s._id}"]`);
  if (!card) return;
  card.outerHTML = buildServiceCardHTML(s);
});

// Se emite al eliminar un servicio (DELETE /api/services/:sid)
socket.on('servicio_eliminado', ({ _id }) => {
  const card = document.querySelector(`[data-service-id="${_id}"]`);
  if (card) card.remove();
  showToast('🗑 Servicio eliminado');
});

/* ══════════════════════════════════════════════════════════════════════
   RESERVAS — construcción de tarjetas y escucha de eventos
   ══════════════════════════════════════════════════════════════════════ */

function buildBookingServiceLine(bookingId, item) {
  const s = item.service;
  return `
    <div class="booking-service-line">
      <span class="bsl-name">${s.name}</span>
      <span class="bsl-price">$${s.price}</span>
      <div class="qty-stepper">
        <button type="button" onclick="changeQuantity('${bookingId}','${s._id}',${item.quantity},-1)">−</button>
        <span>${item.quantity}</span>
        <button type="button" onclick="changeQuantity('${bookingId}','${s._id}',${item.quantity},1)">+</button>
      </div>
      <button type="button" class="bsl-remove" onclick="removeService('${bookingId}','${s._id}')" title="Quitar servicio">✕</button>
    </div>`;
}

function buildCatalogOptions() {
  const catalog = window.__CATALOG__ || [];
  return catalog.map((s) => `<option value="${s._id}">${s.name} — $${s.price}</option>`).join('');
}

function buildBookingCardHTML(b) {
  const services = (b.services || []).filter((item) => item.service);
  const linesHTML = services.length
    ? services.map((item) => buildBookingServiceLine(b._id, item)).join('')
    : '<p class="bsl-empty">Sin servicios asociados.</p>';

  return `
    <div class="card" data-booking-id="${b._id}">
      <div class="card-top">
        <h3 class="card-title">${b.clientName}</h3>
        <button type="button" class="btn-icon-danger" onclick="deleteBooking('${b._id}')" title="Eliminar reserva">🗑</button>
      </div>
      <p class="card-desc">${b.clientEmail}</p>
      <div class="card-meta" style="margin-bottom:0.5rem;">
        <span>📅 ${b.date}</span>
        <span>🕐 ${b.time}</span>
      </div>
      <span class="badge badge-status">${b.status}</span>
      <div class="booking-services">${linesHTML}</div>
      <form class="add-service-form" onsubmit="return addServiceToBooking(event, '${b._id}')">
        <select required>${buildCatalogOptions()}</select>
        <button type="submit">+ Agregar</button>
      </form>
    </div>`;
}

// Se emite al crear una reserva (POST /api/bookings) — siempre arranca sin servicios
socket.on('nueva_reserva', (b) => {
  showToast(`📅 Nueva reserva de ${b.clientName}`);
  const lista = document.getElementById('listaReservas');
  if (!lista) return;
  lista.insertAdjacentHTML('afterbegin', buildBookingCardHTML(b));
});

// Se emite al agregar/quitar un servicio o cambiar una cantidad — trae la
// reserva ya populada, así se reconstruye la card con el detalle completo
socket.on('reserva_actualizada', (b) => {
  const card = document.querySelector(`[data-booking-id="${b._id}"]`);
  if (!card) return;
  card.outerHTML = buildBookingCardHTML(b);
});

// Se emite al eliminar una reserva completa (DELETE /api/bookings/:bid)
socket.on('reserva_eliminada', ({ _id }) => {
  const card = document.querySelector(`[data-booking-id="${_id}"]`);
  if (card) card.remove();
  showToast('🗑 Reserva eliminada');
});

/* ══════════════════════════════════════════════════════════════════════
   ACCIONES — llamadas desde los botones de las vistas.
   Solo disparan el fetch(); el DOM se actualiza cuando llega el evento
   de Socket.io correspondiente (evita actualizar la pantalla dos veces).
   ══════════════════════════════════════════════════════════════════════ */

async function toggleAvailability(id, current) {
  await fetch(`/api/services/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ available: !current }),
  });
}

async function deleteService(id) {
  if (!confirm('¿Eliminar este servicio del catálogo?')) return;
  await fetch(`/api/services/${id}`, { method: 'DELETE' });
}

async function changeQuantity(bookingId, serviceId, currentQty, delta) {
  const newQty = currentQty + delta;
  if (newQty < 1) return; // para llegar a 0 se usa el botón de quitar servicio
  await fetch(`/api/bookings/${bookingId}/services/${serviceId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity: newQty }),
  });
}

async function removeService(bookingId, serviceId) {
  await fetch(`/api/bookings/${bookingId}/services/${serviceId}`, { method: 'DELETE' });
}

async function deleteBooking(id) {
  if (!confirm('¿Eliminar esta reserva completa?')) return;
  await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
}

function addServiceToBooking(event, bookingId) {
  event.preventDefault();
  const select = event.target.querySelector('select');
  const serviceId = select.value;
  fetch(`/api/bookings/${bookingId}/services/${serviceId}`, { method: 'POST' });
  return false;
}
