const { PrismaClient } = require("@prisma/client");

// Singleton Prisma client. In development, hot-reload creates new module
// instances on each save - the globalThis trick prevents multiple connections.
// Log queries in development for easier debugging.
const globalForPrisma = globalThis;

const prisma =
	globalForPrisma.prisma ||
	new PrismaClient({
		log:
			process.env.NODE_ENV === "development"
				? ["query", "info", "warn", "error"]
				: ["error"],
	});

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
}

module.exports = prisma;
