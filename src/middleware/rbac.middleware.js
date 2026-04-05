const { ROLE_PERMISSIONS } = require("../config/constants");

// Role-based access control.
// authorize(...permissions) returns middleware that checks req.user.role
// against the permission map and supports multiple required permissions.
const authorize = (...requiredPermissions) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, error: "Not authenticated" });
  }

  if (requiredPermissions.length === 0) {
    return next();
  }

  const userPermissions = ROLE_PERMISSIONS[req.user.role] || [];
  const allowed = requiredPermissions.every((permission) =>
    userPermissions.includes(permission)
  );

  if (!allowed) {
    return res.status(403).json({
      success: false,
      error: "Forbidden",
      message: `Role '${req.user.role}' cannot perform this action`,
    });
  }

  return next();
};

module.exports = {
  authorize,
};
