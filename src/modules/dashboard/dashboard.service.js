const { Prisma } = require("@prisma/client");
const prisma = require("../../config/db");

class DashboardService {
  // This service combines Prisma aggregations and one raw SQL query for monthly rollups.
  async getSummary({ startDate, endDate } = {}) {
    const parsedStartDate = startDate ? new Date(startDate) : null;
    const parsedEndDate = endDate ? new Date(endDate) : null;

    const where = {
      deletedAt: null,
      // Apply optional date filtering only when the client supplies bounds.
      ...((startDate||endDate) && { date: {
        ...(parsedStartDate && { gte: parsedStartDate }),
        ...(parsedEndDate && { lte: parsedEndDate }),
      }}),
    };

    // Raw SQL is used here because Prisma does not expose the exact month bucketing we need.
    let whereClause = Prisma.sql`"deletedAt" IS NULL`;

    if (parsedStartDate) {
      whereClause = Prisma.sql`${whereClause} AND "date" >= ${parsedStartDate}`;
    }

    if (parsedEndDate) {
      whereClause = Prisma.sql`${whereClause} AND "date" <= ${parsedEndDate}`;
    }
 
    const [incAgg, expAgg, byCategory, recent, monthly] = await Promise.all([
      prisma.transaction.aggregate({ where: { ...where, type:'INCOME'  }, _sum: { amount: true } }),
      prisma.transaction.aggregate({ where: { ...where, type:'EXPENSE' }, _sum: { amount: true } }),
      prisma.transaction.groupBy({
        by: ['category','type'], where,
        _sum: { amount: true }, _count: { _all: true },
        orderBy: { _sum: { amount: 'desc' } },
      }),
      prisma.transaction.findMany({
        where, take: 10, orderBy: { date: 'desc' },
        select: { id:true, amount:true, type:true, category:true, date:true, notes:true },
      }),
      prisma.$queryRaw`
        SELECT TO_CHAR(DATE_TRUNC('month', "date"), 'YYYY-MM') AS month,
               "type", SUM("amount")::float AS total, COUNT(*)::int AS count
        FROM   "transactions"
        WHERE ${whereClause}
        GROUP  BY DATE_TRUNC('month', "date"), "type"
        ORDER  BY DATE_TRUNC('month', "date") DESC
        LIMIT  24
      `,
    ]);
 
    const totalIncome   = Number(incAgg._sum.amount ?? 0);
    const totalExpenses = Number(expAgg._sum.amount ?? 0);
 
    return {
      summary:          { totalIncome, totalExpenses, netBalance: totalIncome - totalExpenses },
      categoryBreakdown: byCategory.map(c => ({
        category: c.category, type: c.type,
        total: Number(c._sum.amount), count: c._count._all,
      })),
      recentActivity: recent.map((item) => ({
        ...item,
        amount: Number(item.amount),
      })),
      monthlyTrends:  monthly,
    };
  }
}

module.exports = {
  DashboardService,
};
