const { Router } = require("express");
const { authenticate } = require("../../middleware/auth.middleware");
const { authorize } = require("../../middleware/rbac.middleware");
const { validate, transactionSchema, filterSchema } = require("../../utils/validators");
const { PERMISSIONS } = require("../../config/constants");
const ctrl = require("./transaction.controller");

const router = Router();
router.use(authenticate);

router.get("/", authorize(PERMISSIONS.TRANSACTIONS_READ), validate(filterSchema, "query"), ctrl.getTransactions);
router.get("/:id", authorize(PERMISSIONS.TRANSACTIONS_READ), ctrl.getTransaction);
router.post("/", authorize(PERMISSIONS.TRANSACTIONS_WRITE), validate(transactionSchema), ctrl.createTransaction);
router.patch("/:id", authorize(PERMISSIONS.TRANSACTIONS_WRITE), ctrl.updateTransaction);
router.delete("/:id", authorize(PERMISSIONS.TRANSACTIONS_DELETE), ctrl.deleteTransaction);

module.exports = router;
