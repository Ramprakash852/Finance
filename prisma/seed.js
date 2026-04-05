 
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

const prisma = new PrismaClient();
const categories = ["Salary", "Rent", "Food", "Utilities", "Investment", "Healthcare", "Entertainment"];

async function main() {
  // Safe to rerun: clear existing rows first.
  await prisma.transaction.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("Password123!", 12);
  const [admin] = await Promise.all([
    prisma.user.create({
      data: { email: "admin@finance.com", password: hashedPassword, name: "Admin User", role: "ADMIN" },
    }),
    prisma.user.create({
      data: { email: "analyst@finance.com", password: hashedPassword, name: "Analyst User", role: "ANALYST" },
    }),
    prisma.user.create({
      data: { email: "viewer@finance.com", password: hashedPassword, name: "Viewer User", role: "VIEWER" },
    }),
  ]);

  const transactions = Array.from({ length: 20 }, (_, i) => ({
    amount: Number((Math.random() * 4900 + 100).toFixed(2)),
    type: Math.random() > 0.4 ? "INCOME" : "EXPENSE",
    category: categories[Math.floor(Math.random() * categories.length)],
    date: new Date(Date.now() - Math.random() * 90 * 86400000),
    notes: `Auto-generated transaction ${i + 1}`,
    userId: admin.id,
  }));

  await prisma.transaction.createMany({ data: transactions });

  console.log("Seed complete.");
  console.log("admin@finance.com   / Password123!");
  console.log("analyst@finance.com / Password123!");
  console.log("viewer@finance.com  / Password123!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
