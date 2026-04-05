const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../../config/db");
const { AppError } = require("../../utils/errors");

class AuthService {
  async register(data) {
    const exists = await prisma.user.findUnique({ where: { email: data.email } });
    if (exists) {
      throw new AppError("Email already registered", 409);
    }

    const hashed = await bcrypt.hash(data.password, 12);
    const user = await prisma.user.create({
      data: { email: data.email, password: hashed, name: data.name, role: data.role ?? "VIEWER" },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });

    return { user, token: this.#generateToken(user) };
  }

  async login(email, password) {
    const user = await prisma.user.findFirst({ where: { email, isActive: true, deletedAt: null } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new AppError("Invalid email or password", 401);
    }

    const { password: _, ...safe } = user;
    return { user: safe, token: this.#generateToken(user) };
  }

  #generateToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN ?? "7d" }
    );
  }
}

module.exports = {
  AuthService,
};
