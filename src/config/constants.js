// Permission map - roles map to arrays of permission strings.
// Middleware checks permission strings, never role names directly.
// To add a new role: add one entry here. Zero other files change.

const ROLES = {
	ADMIN: "ADMIN",
	ANALYST: "ANALYST",
	VIEWER: "VIEWER",
};

const PERMISSIONS = {
	USERS_READ: "users:read",
	USERS_WRITE: "users:write",
	USERS_DELETE: "users:delete",
	TRANSACTIONS_READ: "transactions:read",
	TRANSACTIONS_WRITE: "transactions:write",
	TRANSACTIONS_DELETE: "transactions:delete",
	DASHBOARD_READ: "dashboard:read",
};

const ROLE_PERMISSIONS = {
	[ROLES.ADMIN]: Object.values(PERMISSIONS),
	[ROLES.ANALYST]: [
		PERMISSIONS.USERS_READ,
		PERMISSIONS.TRANSACTIONS_READ,
		PERMISSIONS.TRANSACTIONS_WRITE,
		PERMISSIONS.TRANSACTIONS_DELETE,
		PERMISSIONS.DASHBOARD_READ,
	],
	[ROLES.VIEWER]: [PERMISSIONS.TRANSACTIONS_READ, PERMISSIONS.DASHBOARD_READ],
};

module.exports = {
	ROLES,
	PERMISSIONS,
	ROLE_PERMISSIONS,
};
