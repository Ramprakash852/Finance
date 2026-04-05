class AppError extends Error {
	constructor(message, statusCode = 500, isOperational = true, details) {
		super(message);
		this.name = "AppError";
		this.statusCode = statusCode;
		this.isOperational = isOperational;
		this.details = details;
		Error.captureStackTrace(this, this.constructor);
	}
}

const toAppError = (error) => {
	if (error instanceof AppError) {
		return error;
	}

	// Wrap unknown errors so the handler can return a consistent operational shape.
	const wrapped = new AppError("Internal Server Error", 500, false);
	wrapped.originalError = error;
	return wrapped;
};

module.exports = {
	AppError,
	toAppError,
};
