# 🦷 DentalClinic — API REST con Consultas Avanzadas y Validación

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-Validation-3E67B1?style=for-the-badge&logo=zod&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-4.x-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![Handlebars](https://img.shields.io/badge/Handlebars-7.x-f0772b?style=for-the-badge&logo=handlebarsdotjs&logoColor=white)

> Sistema backend profesional para gestión de turnos y reservas odontológicas: API REST con filtros, paginación, validación con Zod, relaciones con `populate`, vistas server-side y tiempo real.

---

## 📋 Descripción

Esta entrega profesionaliza los endpoints principales del Sistema Backend de Turnos y Reservas de **DentalClinic**:

- 🔎 **Consultas avanzadas** en `GET /api/services` — filtros, paginación y ordenamiento
- 🛡️ **Validación con Zod** que corta el flujo antes de tocar la base de datos
- 🔗 **Relaciones con `populate`** entre reservas y servicios
- 🏗️ Arquitectura en capas intacta: `routes → controllers → services → repositories → DAO → models`

---

## 📁 Estructura del proyecto

```
dental-clinic/
│
├── src/
│   ├── config/
│   │   ├── env.config.js
│   │   └── db.js
│   ├── models/
│   │   ├── service.model.js
│   │   ├── booking.model.js          ← services: [{ service: ObjectId, quantity }]
│   │   └── message.model.js
│   ├── validators/                    ← 🆕 esquemas de Zod
│   │   ├── services.validator.js
│   │   └── bookings.validator.js
│   ├── middlewares/                   ← 🆕 corta el flujo antes del controller
│   │   └── validate.middleware.js
│   ├── dao/
│   │   ├── services.dao.js            ← ahora soporta filter + sort + skip + limit
│   │   ├── bookings.dao.js            ← ahora incluye getByIdPopulated
│   │   └── messages.dao.js
│   ├── repositories/
│   │   ├── services.repository.js
│   │   ├── bookings.repository.js
│   │   └── messages.repository.js
│   ├── services/
│   │   ├── services.service.js        ← calcula filtros, paginación y orden
│   │   ├── bookings.service.js        ← getBookingById usa populate
│   │   └── messages.service.js
│   ├── controllers/
│   │   ├── services.controller.js
│   │   ├── bookings.controller.js
│   │   ├── messages.controller.js
│   │   └── views.controller.js
│   ├── routes/
│   │   ├── services.router.js         ← aplica validateBody como middleware
│   │   ├── bookings.router.js         ← aplica validateBody y validateParams
│   │   ├── messages.router.js
│   │   └── views.router.js
│   ├── views/
│   │   ├── layouts/main.handlebars
│   │   ├── services.handlebars
│   │   └── bookings.handlebars
│   ├── app.js
│   └── server.js
│
├── public/
│   ├── css/styles.css
│   └── js/socket.js
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Instalación

```bash
git clone https://github.com/Vanesa-291/dental-clinic-service-manager.git
cd dental-clinic-service-manager
npm install
copy .env.example .env
```

Completá `.env`:
```env
PORT=8080
NODE_ENV=development
MONGO_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/<dbname>?appName=<appName>
```

## ▶️ Ejecución

```bash
npm start      # producción
npm run dev    # con recarga automática
npm test       # tests
```

---

## 🔎 Consultas avanzadas — `GET /api/services`

Acepta los siguientes query params, todos opcionales y combinables:

| Param | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `category` | string | Filtra por categoría (no distingue mayúsculas/minúsculas) | `?category=Cirugia` |
| `available` | boolean | Filtra por disponibilidad | `?available=true` |
| `page` | number | Página a consultar (default: 1) | `?page=2` |
| `limit` | number | Resultados por página (default: 10) | `?limit=5` |
| `sortBy` | string | Campo de orden: `name`, `price`, `duration`, `category`, `createdAt` | `?sortBy=price` |
| `order` | string | `asc` o `desc` (default: `asc`) | `?order=desc` |

### Ejemplos

```
GET /api/services?category=Cirugia&available=true
GET /api/services?page=2&limit=5
GET /api/services?sortBy=price&order=desc
GET /api/services?category=Estetica&sortBy=duration&order=asc&page=1&limit=3
```

### Formato de respuesta

```json
{
  "payload": [
    { "_id": "...", "name": "Implantes Dentales", "price": 80000, "category": "Cirugía", "...": "..." }
  ],
  "totalItems": 6,
  "totalPages": 2,
  "currentPage": 1,
  "limit": 5,
  "hasPrevPage": false,
  "hasNextPage": true,
  "prevPage": null,
  "nextPage": 2
}
```

---

## 🛡️ Validación con Zod

Los esquemas viven en `src/validators/` y se aplican como **middleware** en las rutas (nunca dentro de los archivos de rutas ni de los modelos). Si los datos no cumplen el esquema, la petición **nunca llega a MongoDB**: se corta con `400` y un mensaje claro.

### Dónde se aplica

| Endpoint | Esquema |
|----------|---------|
| `POST /api/services` | `createServiceSchema` — todos los campos obligatorios |
| `PUT /api/services/:sid` | `updateServiceSchema` — campos opcionales, al menos uno |
| `POST /api/bookings` | `createBookingSchema` — valida incluso formato de email |
| `POST /api/bookings/:bid/services/:sid` | `addServiceParamsSchema` — valida formato de ObjectId en los params |

### Ejemplo — crear servicio incompleto

```bash
POST /api/services
Content-Type: application/json

{ "name": "Endodoncia" }
```

**Respuesta `400`:**
```json
{
  "error": "La descripción es obligatoria. La duración es obligatoria. El precio es obligatorio. La categoría es obligatoria. available es obligatorio."
}
```

### Ejemplo — email inválido en una reserva

```bash
POST /api/bookings
Content-Type: application/json

{ "clientName": "Ana", "clientEmail": "no-es-un-email", "date": "2025-08-15", "time": "10:00", "status": "pendiente" }
```

**Respuesta `400`:**
```json
{ "error": "El email no tiene un formato válido." }
```

---

## 🔗 Relación entre reservas y servicios (`populate`)

El modelo `Booking` **nunca** guarda el objeto completo del servicio — solo la referencia:

```js
services: [{ service: ObjectId, quantity: Number }]
```

Al consultar una reserva puntual, `GET /api/bookings/:bid` usa `populate('services.service')` para traer el detalle completo de cada servicio asociado, sin haberlo duplicado en la base de datos.

### Ejemplo

```
GET /api/bookings/64f1a2b3c4d5e6f7a8b9c0d1
```

**Respuesta `200` (con populate):**
```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
  "clientName": "María González",
  "clientEmail": "maria@email.com",
  "date": "2025-08-15",
  "time": "10:00",
  "status": "pendiente",
  "services": [
    {
      "service": {
        "_id": "64f1a2b3c4d5e6f7a8b9c0aa",
        "name": "Ortodoncia",
        "description": "Brackets para corregir posición dental.",
        "duration": 60,
        "price": 15000,
        "category": "Correctiva",
        "available": true
      },
      "quantity": 2
    }
  ]
}
```

> Nota: `populate` se usa solo para **consultar**. Al agregar un servicio a una reserva (`POST /api/bookings/:bid/services/:sid`), lo que se persiste siempre es la referencia `ObjectId`, nunca el objeto completo.

---

## 📡 Endpoints completos

### 🔧 Services

| Método | Ruta | Validación | Status |
|--------|------|------------|--------|
| `GET` | `/api/services` | — | 200 |
| `GET` | `/api/services/:sid` | — | 200 / 404 |
| `POST` | `/api/services` | Zod (body) | 201 / 400 |
| `PUT` | `/api/services/:sid` | Zod (body) | 200 / 404 / 400 |
| `DELETE` | `/api/services/:sid` | — | 200 / 404 |

### 📅 Bookings

| Método | Ruta | Validación | Status |
|--------|------|------------|--------|
| `POST` | `/api/bookings` | Zod (body) | 201 / 400 |
| `GET` | `/api/bookings/:bid` | — (usa `populate`) | 200 / 404 |
| `POST` | `/api/bookings/:bid/services/:sid` | Zod (params) | 200 / 404 |

### 💬 Messages

| Método | Ruta | Status |
|--------|------|--------|
| `GET` | `/api/messages` | 200 |
| `GET` | `/api/messages/:mid` | 200 / 404 |
| `POST` | `/api/messages` | 201 / 400 |
| `PUT` | `/api/messages/:mid` | 200 / 404 |
| `DELETE` | `/api/messages/:mid` | 200 / 404 |

### 🌐 Vistas (Handlebars)

| Ruta | Descripción |
|------|-------------|
| `GET /views/services` | Catálogo completo desde MongoDB |
| `GET /views/bookings` | Reservas desde MongoDB |

---

## ⚡ Socket.io — Tiempo real

| Evento | Se emite cuando... | Efecto |
|--------|---------------------|--------|
| `nuevo_servicio` | Se crea un servicio vía `POST /api/services` | Aparece la card sin recargar |
| `nueva_reserva` | Se crea una reserva vía `POST /api/bookings` | Aparece la card sin recargar |

---

## 🏗️ Arquitectura en capas

```
📨 REQUEST
      ↓
🛣️  Router       → define endpoints + aplica middleware de validación
      ↓
🛡️  Validate     → Zod corta el flujo con 400 si los datos no son válidos
      ↓
🎮  Controller   → lee req, llama al service, responde con res
      ↓
⚙️  Service      → filtros, paginación, orden, reglas de negocio (sin req/res)
      ↓
📦  Repository   → acceso a datos (sin reglas de negocio)
      ↓
🗄️  DAO          → find/sort/skip/limit/populate directo sobre Mongoose
      ↓
🍃  MongoDB Atlas
```

> Las validaciones de Zod **nunca** reemplazan a las de Mongoose (`required: true` sigue en los modelos como última red de seguridad), pero son las que efectivamente detienen datos inválidos antes de llegar a la base.

---

## 📦 Dependencias

| Paquete | Versión | Uso |
|---------|---------|-----|
| `express` | `^4.19.2` | Framework HTTP |
| `mongoose` | `^8.4.1` | ODM para MongoDB |
| `express-handlebars` | `^7.1.2` | Vistas server-side |
| `socket.io` | `^4.7.5` | Tiempo real |
| `zod` | `^3.23.8` | Validación de esquemas |
| `dotenv` | `^16.4.5` | Variables de entorno |

---

<div align="center">

**Desarrollado con ❤️ para DentalClinic**

*Tu Sonrisa, Nuestra Pasión* 🦷✨

</div>
