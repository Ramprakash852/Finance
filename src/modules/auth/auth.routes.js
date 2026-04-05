const { Router } = require("express");
const { register, login, getMe } = require("./auth.controller");
const { authenticate } = require("../../middleware/auth.middleware");
const { validate, registerSchema, loginSchema } = require("../../utils/validators");

const router = Router();

// Public auth endpoints for registration, login, and current-user lookup.
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", authenticate, getMe);

module.exports = router;
