// ─── Middleware genérico de validación con Zod ─────────────────────────────
// Corta el flujo ANTES de llegar al controller/service/MongoDB si los datos
// no cumplen con el esquema. Nunca se mezcla con la lógica de las rutas:
// las rutas solo lo referencian, todo el detalle vive acá y en /validators.

export const validateBody = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.errors.map((e) => e.message);
    return res.status(400).json({ error: errors.join(' ') });
  }

  next();
};

export const validateParams = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.params);

  if (!result.success) {
    const errors = result.error.errors.map((e) => e.message);
    return res.status(400).json({ error: errors.join(' ') });
  }

  next();
};
