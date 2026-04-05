const { z } = require("zod");

const registerSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1).max(100),
  role: z.enum(["ADMIN", "ANALYST", "VIEWER"]).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const transactionSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  type: z.enum(["INCOME", "EXPENSE"]),
  category: z.string().min(1).max(50),
  date: z.string().datetime("Use ISO 8601 format"),
  notes: z.string().max(500).optional(),
});

const filterSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]).optional(),
  category: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  role: z.enum(["ADMIN", "ANALYST", "VIEWER"]).optional(),
  isActive: z.boolean().optional(),
});

// validate() is a middleware factory. Pass any schema and source ("body" | "query").
const validate = (schema, source = "body") => (req, res, next) => {
  const result = schema.safeParse(req[source]);
  if (!result.success) {
    // Normalize Zod issues so clients get a compact field/message structure.
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      details: result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }
  req[source] = result.data;
  next();
};

module.exports = {
  registerSchema,
  loginSchema,
  transactionSchema,
  filterSchema,
  updateUserSchema,
  validate,
};
