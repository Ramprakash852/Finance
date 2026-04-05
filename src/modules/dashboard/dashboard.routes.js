const { Router } = require("express");
const { authenticate } = require("../../middleware/auth.middleware");
const { authorize } = require("../../middleware/rbac.middleware");
const { PERMISSIONS } = require("../../config/constants");
const { DashboardService } = require("./dashboard.service");
const { sendSuccess } = require("../../utils/response");

const router = Router();
const svc = new DashboardService();

// Dashboard summary is protected by auth + dashboard read permission.
router.get("/summary", authenticate, authorize(PERMISSIONS.DASHBOARD_READ), async (req, res, next) => {
  try {
    const data = await svc.getSummary(req.query);
    return sendSuccess(res, 200, "Dashboard summary", data);
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
