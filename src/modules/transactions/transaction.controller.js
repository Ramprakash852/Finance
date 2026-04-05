const { TransactionService } = require("./transaction.service");
const { sendSuccess } = require("../../utils/response");

const svc = new TransactionService();

// Wrap async handlers so errors always reach Express's error middleware.
const wrap = (fn) => async (req, res, next) => {
  try {
    await fn(req, res);
  } catch (e) {
    next(e);
  }
};

const createTransaction = wrap(async (req, res) => {
  const data = await svc.create(req.body, req.user.id);
  return sendSuccess(res, 201, "Created", data);
});

const getTransactions = wrap(async (req, res) => {
  const data = await svc.getAll(req.query);
  return sendSuccess(res, 200, "OK", data);
});

const getTransaction = wrap(async (req, res) => {
  const data = await svc.getById(req.params.id);
  return sendSuccess(res, 200, "OK", data);
});

const updateTransaction = wrap(async (req, res) => {
  const data = await svc.update(req.params.id, req.body);
  return sendSuccess(res, 200, "Updated", data);
});

const deleteTransaction = wrap(async (req, res) => {
  await svc.delete(req.params.id);
  return sendSuccess(res, 200, "Deleted", null);
});

module.exports = {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
};
