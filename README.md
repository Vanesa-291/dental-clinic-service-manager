# 🦷 Sistema Backend de Turnos y Reservas — DentalClinic

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-Validation-3E67B1?style=for-the-badge&logo=zod&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-4.x-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![Handlebars](https://img.shields.io/badge/Handlebars-7.x-f0772b?style=for-the-badge&logo=handlebarsdotjs&logoColor=white)

> **Entrega Final** — Backend completo para la gestión de servicios y reservas de una clínica odontológica.

---

## 📋 Descripción

Este proyecto es la versión final del **Sistema Backend de Turnos y Reservas** de DentalClinic. Es una API REST construida en capas que permite:

- Administrar el catálogo de **servicios** odontológicos (crear, listar con filtros/paginación/orden, consultar, actualizar, eliminar).
- Gestionar **reservas** de clientes: crearlas, consultarlas, asociarles servicios existentes, modificar la cantidad de cada servicio, quitar servicios puntuales, y eliminar la reserva completa.
- Consultar la información **relacionada** entre reservas y servicios usando referencias (`ObjectId`) y `populate`, sin duplicar datos.
- Visualizar el catálogo y las reservas desde el navegador mediante **vistas Handlebars**, que se actualizan **en vivo** con **Socket.io** al crear, editar o eliminar cualquier recurso — sin recargar la página.

---

## 🛠️ Tecnologías utilizadas

| Tecnología | Uso |
|---|---|
| **Node.js** (ESM) | Entorno de ejecución |
| **Express** | Framework HTTP / enrutamiento |
| **MongoDB Atlas** | Base de datos en la nube |
| **Mongoose** | ODM — modelos, esquemas, `populate` |
| **Zod** | Validación de datos de entrada |
| **express-handlebars** | Vistas renderizadas del lado del servidor |
| **Socket.io** | Comunicación en tiempo real |
| **dotenv** | Variables de entorno |

---

## 📁 Estructura del proyecto

```
dental-clinic/
├── src/
│   ├── config/            → env.config.js (valida .env) · db.js (conexión Mongo)
│   ├── models/             → service.model.js · booking.model.js · message.model.js
│   ├── validators/         → esquemas de Zod (services y bookings)
│   ├── middlewares/         → validate.middleware.js (corta el flujo con 400)
│   ├── dao/                 → acceso directo a Mongoose (find, populate, etc.)
│   ├── repositories/        → intermediario entre service y DAO, sin lógica de negocio
│   ├── services/            → reglas de negocio (filtros, paginación, quantity++, etc.)
│   ├── controllers/         → leen req, llaman al service, responden con res
│   ├── routes/               → definen endpoints y conectan con su controller
│   ├── views/                → services.handlebars · bookings.handlebars · layouts/main.handlebars
│   ├── app.js                 → configuración de Express + Handlebars
│   └── server.js              → conecta Mongo, levanta Socket.io y el servidor HTTP
├── public/
│   ├── css/styles.css
│   └── js/socket.js           → toda la lógica de tiempo real del lado del cliente
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

**Flujo de una petición:**
```
Router → Controller → Service → Repository → DAO → Model (Mongoose) → MongoDB Atlas
```

Cada capa tiene una sola responsabilidad: el router solo define endpoints, el controller solo traduce HTTP ↔ JS, el service contiene las reglas de negocio, el repository es un intermediario sin lógica propia, y el DAO es el único lugar que habla directamente con Mongoose.

---

## 🚀 Instalación

### Requisitos previos
- [Node.js](https://nodejs.org/) v18 o superior
- Una cuenta de [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (gratuita)

### Pasos

```bash
git clone https://github.com/Vanesa-291/dental-clinic-service-manager.git
cd dental-clinic-service-manager
npm install
```

---

## 🔐 Variables de entorno

Copiá el archivo de ejemplo:

```bash
copy .env.example .env
```

Y completá `.env` con tus propios valores:

```env
PORT=8080
NODE_ENV=development
MONGO_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/<dbname>?appName=<appName>
APP_NAME=Sistema Backend de Turnos y Reservas
```

| Variable | Descripción |
|---|---|
| `PORT` | Puerto en el que corre el servidor |
| `NODE_ENV` | Entorno de ejecución (`development` / `production`) |
| `MONGO_URI` | Cadena de conexión a MongoDB Atlas |
| `APP_NAME` | Nombre que se muestra en el arranque del servidor y en la ruta raíz |

> 🔒 El archivo `.env` **nunca** se sube al repositorio — está en `.gitignore`. Usá `.env.example` como guía.
>
> **Nota:** usamos `NODE_ENV` (la convención estándar de Node.js) en lugar de un `APP_ENV` custom, para seguir la práctica más habitual del ecosistema.

---

## ▶️ Ejecución

```bash
npm start       # modo normal
npm run dev      # con recarga automática al guardar cambios
npm test          # placeholder de tests
```

Servidor disponible en: **http://localhost:8080**

Vistas disponibles en el navegador:
- **http://localhost:8080/views/services** — catálogo de servicios
- **http://localhost:8080/views/bookings** — gestión de reservas

---

## 📡 Endpoints principales

### 🔧 Servicios (`/api/services`)

| Método | Ruta | Descripción | Status |
|---|---|---|---|
| `GET` | `/api/services` | Lista con filtros, paginación y orden | 200 |
| `GET` | `/api/services/:sid` | Servicio por ID | 200 / 404 |
| `POST` | `/api/services` | Crear servicio (validado con Zod) | 201 / 400 |
| `PUT` | `/api/services/:sid` | Actualizar servicio (validado con Zod) | 200 / 404 / 400 |
| `DELETE` | `/api/services/:sid` | Eliminar servicio | 200 / 404 |

**Filtros, paginación y orden — todos combinables:**

```
GET /api/services?category=Cirugia&available=true
GET /api/services?page=2&limit=5
GET /api/services?sortBy=price&order=desc
```

Respuesta con metadatos:
```json
{
  "payload": [ /* ... */ ],
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

### 📅 Reservas (`/api/bookings`)

| Método | Ruta | Descripción | Status |
|---|---|---|---|
| `GET` | `/api/bookings` | Todas las reservas (con `populate`) | 200 |
| `POST` | `/api/bookings` | Crear reserva (validado con Zod) | 201 / 400 |
| `GET` | `/api/bookings/:bid` | Reserva por ID (con `populate`) | 200 / 404 |
| `DELETE` | `/api/bookings/:bid` | Eliminar una reserva completa | 200 / 404 |
| `POST` | `/api/bookings/:bid/services/:sid` | Agregar servicio (`quantity++` si ya estaba) | 200 / 404 |
| `PUT` | `/api/bookings/:bid/services/:sid` | Actualizar la cantidad de un servicio | 200 / 404 / 400 |
| `DELETE` | `/api/bookings/:bid/services/:sid` | Quitar un servicio puntual de la reserva | 200 / 404 |

**Ejemplo — reserva con `populate`:**
```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
  "clientName": "María González",
  "status": "pendiente",
  "services": [
    {
      "service": { "_id": "...", "name": "Ortodoncia", "price": 15000, "duration": 60 },
      "quantity": 2
    }
  ]
}
```

### 💬 Mensajes (`/api/messages`)
CRUD completo (`GET`, `GET /:mid`, `POST`, `PUT /:mid`, `DELETE /:mid`).

---

## ✨ Funcionalidades

- ✅ **CRUD completo de servicios**, con validación de Zod cortando el flujo antes de tocar MongoDB.
- ✅ **Gestión completa de reservas**: crear, consultar, asociar servicios, **modificar cantidades**, **quitar un servicio puntual**, y **eliminar la reserva**.
- ✅ **Filtros, paginación y ordenamiento** en `GET /api/services` vía query params.
- ✅ **Relaciones con `ObjectId`**: las reservas nunca guardan el objeto completo del servicio, solo la referencia + `quantity`.
- ✅ **`populate`** en la consulta de reservas (individual y en listado).
- ✅ **Validación con Zod** en: crear/actualizar servicio, crear reserva, agregar/actualizar/quitar servicio de una reserva.
- ✅ **Vistas con Handlebars**: catálogo de servicios y gestión de reservas, sin datos hardcodeados — todo viene de la arquitectura en capas.
- ✅ **Socket.io en tiempo real**: crear, actualizar (incluye cambiar disponibilidad) y eliminar un servicio; crear, actualizar y eliminar una reserva — todo se refleja en el navegador sin recargar.

### Detalle de los eventos de Socket.io

| Evento | Se dispara cuando... |
|---|---|
| `nuevo_servicio` | Se crea un servicio |
| `servicio_actualizado` | Se actualiza un servicio (incluye cambios de disponibilidad) |
| `servicio_eliminado` | Se elimina un servicio |
| `nueva_reserva` | Se crea una reserva |
| `reserva_actualizada` | Se agrega/quita un servicio o cambia una cantidad en una reserva |
| `reserva_eliminada` | Se elimina una reserva completa |

---

## 🧪 Pruebas manuales sugeridas

Antes de entregar, se probaron manualmente con Thunder Client:

1. ✅ Crear servicio
2. ✅ Listar servicios (con filtros/paginación/orden)
3. ✅ Consultar servicio por id
4. ✅ Actualizar servicio
5. ✅ Eliminar servicio
6. ✅ Crear reserva
7. ✅ Consultar reserva
8. ✅ Agregar servicio a reserva
9. ✅ Eliminar servicio de reserva
10. ✅ Actualizar cantidad de un servicio dentro de una reserva
11. ✅ Eliminar reserva
12. ✅ Consultar reserva con `populate`

**Casos de error probados:**
- Buscar un servicio inexistente → `404`
- Crear un servicio con datos incompletos → `400` (Zod)
- Agregar a una reserva un servicio que no existe → `404`
- Consultar una reserva inexistente → `404`

**WebSockets:** se verificó que crear un servicio desde Thunder Client, eliminar un servicio y cambiar su disponibilidad se reflejan en `/views/services` sin recargar manualmente la página (y lo mismo para reservas en `/views/bookings`).

---

## 📝 Notas adicionales

- Si un servicio referenciado en una reserva es eliminado del catálogo, la vista de reservas lo omite de forma segura (referencia huérfana) en lugar de romperse; la API expone ese caso como `service: null` dentro del array.
- La vista de servicios no implementa controles de paginación (muestra el catálogo completo); la paginación real para consumidores programáticos vive en `GET /api/services`.
- El repositorio no incluye `node_modules`, `.env`, ni credenciales reales — solo `.env.example` como guía de configuración.

---

<div align="center">

**Desarrollado con ❤️ para DentalClinic**

*Tu Sonrisa, Nuestra Pasión* 🦷✨

</div>
