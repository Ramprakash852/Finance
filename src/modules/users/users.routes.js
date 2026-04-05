const { Router } = require("express");
const { authenticate } = require("../../middleware/auth.middleware");
const { authorize } = require("../../middleware/rbac.middleware");
const { validate, updateUserSchema } = require("../../utils/validators");
const { PERMISSIONS } = require("../../config/constants");
const prisma = require("../../config/db");
const { sendSuccess } = require("../../utils/response");
const { AppError } = require("../../utils/errors");

const router = Router();
router.use(authenticate, authorize(PERMISSIONS.USERS_READ));

router.get("/", async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      where: { deletedAt: null },
      select: { id: true, email: true, name: true, role: true, isActive: true, createdAt: true },
    });
    return sendSuccess(res, 200, "Users fetched", users);
  } catch (e) {
    return next(e);
  }
});

router.patch("/:id", authorize(PERMISSIONS.USERS_WRITE), validate(updateUserSchema), async (req, res, next) => {
  try {
    const user = await prisma.user.findFirst({ where: { id: req.params.id, deletedAt: null } });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: req.body,
      select: { id: true, email: true, name: true, role: true, isActive: true },
    });
    return sendSuccess(res, 200, "User updated", updated);
  } catch (e) {
    return next(e);
  }
});

router.delete("/:id", authorize(PERMISSIONS.USERS_DELETE), async (req, res, next) => {
  try {
    const user = await prisma.user.findFirst({ where: { id: req.params.id, deletedAt: null } });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    await prisma.user.update({
      where: { id: req.params.id },
      data: { deletedAt: new Date(), isActive: false },
    });
    return sendSuccess(res, 200, "User deactivated", null);
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
