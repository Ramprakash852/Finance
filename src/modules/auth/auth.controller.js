const { AuthService } = require("./auth.service");
const { sendSuccess } = require("../../utils/response");

const svc = new AuthService();

// Controller layer keeps HTTP response formatting separate from auth logic.
const register = async (req, res, next) => {
  try {
    const data = await svc.register(req.body);
    return sendSuccess(res, 201, "Registered", data);
  } catch (e) {
    return next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const data = await svc.login(req.body.email, req.body.password);
    return sendSuccess(res, 200, "Logged in", data);
  } catch (e) {
    return next(e);
  }
};

const getMe = (req, res) => sendSuccess(res, 200, "Current user", req.user);

module.exports = {
  register,
  login,
  getMe,
};
