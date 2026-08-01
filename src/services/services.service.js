import ServicesRepository from '../repositories/services.repository.js';

const repository = new ServicesRepository();

const ALLOWED_SORT_FIELDS = ['name', 'price', 'duration', 'category', 'createdAt'];

// ─── Escapa caracteres especiales de regex para usar "category" con seguridad ─
function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

class ServicesService {
  // ─── GET /api/services con filtros, paginación y ordenamiento ───────────
  async getServices(query = {}) {
    const {
      category,
      available,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'asc',
    } = query;

    // Construye el filtro para Mongo (se aplica ANTES de paginar, no después)
    const filter = {};
    if (category) filter.category = new RegExp(`^${escapeRegex(category)}$`, 'i');
    if (available !== undefined) filter.available = available === 'true';

    const pageNum = Math.max(parseInt(page) || 1, 1);
    const limitNum = Math.max(parseInt(limit) || 10, 1);
    const skip = (pageNum - 1) * limitNum;

    const sortField = ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : 'createdAt';
    const sortOrder = order === 'desc' ? -1 : 1;
    const sort = { [sortField]: sortOrder };

    const [services, total] = await Promise.all([
      repository.getAll(filter, { skip, limit: limitNum, sort }),
      repository.count(filter),
    ]);

    const totalPages = Math.max(Math.ceil(total / limitNum), 1);

    return {
      payload: services,
      totalItems: total,
      totalPages,
      currentPage: pageNum,
      limit: limitNum,
      hasPrevPage: pageNum > 1,
      hasNextPage: pageNum < totalPages,
      prevPage: pageNum > 1 ? pageNum - 1 : null,
      nextPage: pageNum < totalPages ? pageNum + 1 : null,
    };
  }

  async getServiceById(id) {
    try { return await repository.getById(id); } catch { return null; }
  }

  // ─── El formato de los datos ya fue validado por Zod antes de llegar acá ─
  async createService(data) {
    return await repository.create(data);
  }

  async updateService(id, data) {
    // Regla de negocio: nunca se permite modificar el id (no es tarea de Zod,
    // es una regla propia del dominio de servicios)
    if (data.id !== undefined || data._id !== undefined) {
      return { error: 'No está permitido modificar el id de un servicio.' };
    }
    try {
      const updated = await repository.update(id, data);
      return updated || null;
    } catch { return null; }
  }

  async deleteService(id) {
    try {
      const deleted = await repository.delete(id);
      if (!deleted) return null;
      return { message: `El servicio "${deleted.name}" fue eliminado correctamente.`, deleted };
    } catch { return null; }
  }
}

export default ServicesService;
