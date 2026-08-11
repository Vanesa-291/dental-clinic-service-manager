# 🦷 DentalClinic — Sistema Backend de Turnos y Reservas

Sistema backend de gestión de turnos y reservas para una clínica odontológica. API REST construida con Node.js y Express, persistencia en MongoDB Atlas mediante Mongoose, actualizaciones en tiempo real con Socket.io, y vistas dinámicas renderizadas con Handlebars.

---

## 📋 Descripción

DentalClinic permite administrar el catálogo de servicios odontológicos de una clínica y gestionar las reservas de turnos que los pacientes hacen sobre esos servicios. Cada reserva puede tener uno o más servicios asociados, con control de cantidad por servicio. Todos los cambios (crear, actualizar, eliminar) se reflejan en tiempo real en las vistas abiertas en el navegador, sin necesidad de recargar la página.

El proyecto sigue una arquitectura en capas que separa responsabilidades:

```
Router → Middleware (validación) → Controller → Service → Repository → DAO → Modelo (Mongoose)
```

---

## 🛠️ Tecnologías utilizadas

| Tecnología | Uso |
|---|---|
| [Node.js](https://nodejs.org/) (ESM) | Entorno de ejecución, módulos ES nativos |
| [Express.js](https://expressjs.com/) | Framework del servidor HTTP y del ruteo |
| [MongoDB Atlas](https://www.mongodb.com/atlas) + [Mongoose](https://mongoosejs.com/) | Base de datos y modelado de esquemas |
| [Socket.io](https://socket.io/) | Comunicación en tiempo real (WebSockets) |
| [express-handlebars](https://github.com/express-handlebars/express-handlebars) | Motor de plantillas para las vistas |
| [Zod](https://zod.dev/) | Validación de datos de entrada |
| [dotenv](https://github.com/motdotla/dotenv) | Carga de variables de entorno |

---

## 📁 Estructura del proyecto

```
dental-clinic-service-manager/
│
├── src/
│   ├── config/
│   │   ├── db.js                  ← Conexión a MongoDB Atlas
│   │   └── env.config.js          ← Validación de variables de entorno al iniciar
│   ├── models/                    ← Schemas de Mongoose (Service, Booking, Message)
│   ├── dao/                       ← Acceso directo a los modelos de Mongoose
│   ├── repositories/              ← Capa intermedia entre los DAO y los services
│   ├── services/                  ← Lógica de negocio
│   ├── validators/                ← Esquemas de validación con Zod
│   ├── middlewares/
│   │   └── validate.middleware.js ← Middleware genérico de validación (body / params)
│   ├── controllers/                ← Maneja request/response y emite eventos de Socket.io
│   ├── routes/                    ← Define los endpoints de cada recurso
│   ├── views/                     ← Vistas Handlebars
│   │   ├── layouts/main.handlebars
│   │   ├── services.handlebars
│   │   └── bookings.handlebars
│   ├── app.js                     ← Configuración de Express (middlewares, motor de vistas, rutas)
│   └── server.js                  ← Punto de entrada: servidor HTTP + Socket.io + conexión a Mongo
│
├── public/
│   ├── css/styles.css
│   └── js/socket.js                ← Cliente de Socket.io y lógica de interacción de la UI
│
├── .env.example                    ← Variables de entorno requeridas (sin valores)
├── .gitignore                      ← Excluye node_modules, .env y archivos temporales
├── package.json
└── README.md                       ← Este archivo
```

---

## 🚀 Instalación

### Requisitos previos

- [Node.js](https://nodejs.org/) versión 18 o superior
- Una base de datos en [MongoDB Atlas](https://www.mongodb.com/atlas) (o una instancia local de MongoDB)

### Pasos

1. **Cloná el repositorio:**
```
git clone https://github.com/Vanesa-291/dental-clinic-service-manager.git
cd dental-clinic-service-manager
```

2. **Instalá las dependencias:**
```
npm install
```

3. **Configurá las variables de entorno** (ver sección siguiente).

4. **Ejecutá el proyecto** (ver sección Ejecución).

---

## 🔐 Variables de entorno

Creá un archivo `.env` en la raíz del proyecto, usando `.env.example` como referencia:

```
PORT=8080
NODE_ENV=development
MONGO_URI=tu_uri_de_mongodb_atlas
APP_NAME=Sistema Backend de Turnos y Reservas
```

| Variable | Descripción |
|---|---|
| `PORT` | Puerto en el que corre el servidor |
| `NODE_ENV` | Entorno de ejecución (`development` / `production`) |
| `MONGO_URI` | Cadena de conexión a la base de datos de MongoDB Atlas |
| `APP_NAME` | Nombre visible de la aplicación |

> ⚠️ El archivo `.env` **nunca** debe subirse al repositorio — está excluido en `.gitignore`. El servidor valida al arrancar que las 4 variables estén presentes y no inicia si falta alguna.

---

## ▶️ Ejecución

```
npm start
```

Con recarga automática al guardar cambios:
```
npm run dev
```

Si la conexión es exitosa, la consola muestra:

```
✅ Variables de entorno validadas correctamente.
✅ MongoDB conectado correctamente.
══════════════════════════════════════════════════════════
  🦷 Sistema Backend de Turnos y Reservas
  Servidor     : http://localhost:8080
  Arquitectura : Router → Controller → Service → Repository → DAO
══════════════════════════════════════════════════════════

```

---

## 🔌 Endpoints principales

### Servicios — `/api/services`

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/services` | Lista todos los servicios. Soporta filtros por query string: `?category=`, `?available=`, `?page=`, `?limit=`, `?sortBy=`, `?order=` |
| `GET` | `/api/services/:sid` | Obtiene un servicio por su ID |
| `POST` | `/api/services` | Crea un nuevo servicio |
| `PUT` | `/api/services/:sid` | Actualiza un servicio existente |
| `DELETE` | `/api/services/:sid` | Elimina un servicio |

### Reservas — `/api/bookings`

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/bookings` | Lista todas las reservas (con `populate` de servicios) |
| `POST` | `/api/bookings` | Crea una nueva reserva |
| `GET` | `/api/bookings/:bid` | Obtiene una reserva por ID (con `populate`) |
| `DELETE` | `/api/bookings/:bid` | Elimina una reserva completa |
| `POST` | `/api/bookings/:bid/services/:sid` | Agrega un servicio a una reserva |
| `PUT` | `/api/bookings/:bid/services/:sid` | Actualiza la cantidad de un servicio dentro de una reserva |
| `DELETE` | `/api/bookings/:bid/services/:sid` | Quita un servicio de una reserva |

### Mensajes — `/api/messages` *(recurso adicional)*

CRUD básico de mensajes de contacto: `GET`, `GET /:mid`, `POST`, `PUT /:mid`, `DELETE /:mid`.

### Vistas

| Ruta | Descripción |
|---|---|
| `/views/services` | Catálogo de servicios, actualizado en tiempo real |
| `/views/bookings` | Gestión de reservas, actualizada en tiempo real |

### Raíz

`GET /` devuelve un JSON con el mapa completo de endpoints disponibles — funciona como documentación viva de la API.

---

## 🗂️ Modelo de datos

### Service

```json
{
  "_id": "66b1f2a4e2c1a4f1e8d3b201",
  "name": "Ortodoncia",
  "description": "Corrección de la posición dental",
  "duration": 60,
  "price": 15000,
  "category": "Correctiva",
  "available": true
}
```

| Campo | Tipo | Obligatorio |
|---|---|---|
| `name` | String | Sí |
| `description` | String | Sí |
| `duration` | Number (minutos) | Sí |
| `price` | Number | Sí |
| `category` | String | Sí |
| `available` | Boolean | Sí (default: `true`) |

### Booking

```json
{
  "_id": "66b2a9c1e2c1a4f1e8d3b210",
  "clientName": "Juan Pérez",
  "clientEmail": "juan@email.com",
  "date": "2026-08-20",
  "time": "14:30",
  "status": "pendiente",
  "services": [
    {
      "service": { "_id": "66b1f2a4e2c1a4f1e8d3b201", "name": "Ortodoncia", "price": 15000 },
      "quantity": 2
    }
  ]
}
```

> El campo `service` dentro de `services` se guarda como referencia (`ObjectId`) y se resuelve automáticamente con `populate` en las consultas de lectura, devolviendo el objeto completo del servicio en lugar de solo su ID.

---

## ⚙️ Funcionalidades

- CRUD completo de servicios, con validación de datos vía Zod y mensajes de error descriptivos en español.
- CRUD de reservas, incluyendo gestión de servicios anidados dentro de cada reserva: agregar, quitar y actualizar cantidad.
- `populate` automático: las reservas devuelven el detalle completo de cada servicio asociado, no solo su ID.
- Actualizaciones en tiempo real vía Socket.io: crear, actualizar o eliminar un servicio o reserva se refleja al instante en cualquier vista abierta, sin recargar la página.
- Vistas dinámicas en Handlebars, con notificaciones tipo "toast" para cada acción.
- Manejo centralizado de errores, con códigos de estado HTTP apropiados (`400` validación, `404` recurso inexistente, `500` error interno).
- Arquitectura en capas que separa responsabilidades y facilita el mantenimiento y las futuras ampliaciones.

### Eventos de Socket.io

| Evento | Se emite cuando... |
|---|---|
| `nuevo_servicio` | Se crea un servicio |
| `servicio_actualizado` | Se actualiza un servicio (incluye cambios de disponibilidad) |
| `servicio_eliminado` | Se elimina un servicio |
| `nueva_reserva` | Se crea una reserva |
| `reserva_actualizada` | Se agrega o quita un servicio, o cambia su cantidad, en una reserva |
| `reserva_eliminada` | Se elimina una reserva completa |

---

## 📝 Notas adicionales

- El archivo `.env` nunca debe subirse al repositorio (está excluido en `.gitignore`); usá `.env.example` como referencia.
- Antes de levantar el proyecto, verificá que tu IP esté habilitada en **Network Access** de MongoDB Atlas.
- Se recomienda probar los endpoints con Postman o Thunder Client, incluyendo casos de error: IDs inexistentes, datos incompletos y IDs con formato inválido.
- El proyecto no incluye autenticación; queda como posible mejora futura.
- El script `npm test` está reservado para cuando se implementen tests automatizados; por ahora es un placeholder.

---

*Desarrollado con ❤️ para DentalClinic — Tu Sonrisa, Nuestra Pasión*