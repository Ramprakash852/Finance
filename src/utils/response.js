const sendSuccess = (res, statusCode = 200, message = "OK", data = null) => {
	return res.status(statusCode).json({
		success: true,
		message,
		data,
	});
};

const sendError = (res, statusCode = 500, error = "Internal Server Error", details) => {
	const payload = {
		success: false,
		error,
	};

	if (details !== undefined) {
		payload.details = details;
	}

	return res.status(statusCode).json(payload);
};

module.exports = {
	sendSuccess,
	sendError,
};
