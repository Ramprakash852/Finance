const prisma = require("../../config/db");

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const toPositiveInt = (value, fallback) => {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return Math.floor(parsed);
};

class TransactionRepository {
  // All Prisma calls for transactions live here.
  create(data) {
    return prisma.transaction.create({ data });
  }

  async findMany({ type, category, startDate, endDate, page, limit } = {}) {
    const safePage = toPositiveInt(page, DEFAULT_PAGE);
    const safeLimit = toPositiveInt(limit, DEFAULT_LIMIT);

    const where = {
      deletedAt: null,
      ...(type && { type }),
      ...(category && { category: { contains: category, mode: "insensitive" } }),
      ...((startDate || endDate) && {
        date: {
        ...(startDate && { gte: new Date(startDate) }),
          ...(endDate && { lte: new Date(endDate) }),
        },
      }),
    };

    const skip = (safePage - 1) * safeLimit;

    // Count and data queries run in parallel for better list performance.
    const [records, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        skip,
        take: safeLimit,
        orderBy: { date: "desc" },
        include: { user: { select: { name: true, email: true } } },
      }),
      prisma.transaction.count({ where }),
    ]);

    return {
      records,
      pagination: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
  }

  findById(id) {
    return prisma.transaction.findFirst({
      where: { id, deletedAt: null },
      include: { user: { select: { name: true, email: true } } },
    });
  }

  async update(id, data) {
    const existing = await prisma.transaction.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });

    if (!existing) {
      return null;
    }

    return prisma.transaction.update({ where: { id }, data });
  }

  async softDelete(id) {
    const existing = await prisma.transaction.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });

    if (!existing) {
      return null;
    }

    return prisma.transaction.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}

module.exports = {
  TransactionRepository,
};
