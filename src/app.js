const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./modules/auth/auth.routes");
const transactionRoutes = require("./modules/transactions/transaction.routes");
const dashboardRoutes = require("./modules/dashboard/dashboard.routes");
const userRoutes = require("./modules/users/users.routes");
const { errorHandler } = require("./middleware/error.middleware");

const app = express();
const API_PREFIX = "/api";

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Lightweight health check for deployment probes and local verification.
app.get("/health", (_, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/transactions`, transactionRoutes);
app.use(`${API_PREFIX}/dashboard`, dashboardRoutes);
app.use(`${API_PREFIX}/users`, userRoutes);

// Return a consistent 404 payload for unknown routes.
app.use((req, res) => res.status(404).json({ success: false, error: `${req.method} ${req.path} not found` }));

// Global error handler must be registered after all routes and fallback handlers.
app.use(errorHandler);

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(`Finance API running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

module.exports = app;
