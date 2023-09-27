class ErrorHandler extends Error {
	status
	errors

	constructor(status, message, errors) {
		super(message)
		this.status = status
		this.errors = errors
	}
	static BadRequest = (message, errors = []) => {
		return new ErrorHandler(400, message, errors)
	}

	static Unauthorized = (message, errors = []) => {
		return new ErrorHandler(401, message ? message : "User not authorized", errors)
	}

	static NotFound = (message, errors = []) => {
		return new ErrorHandler(400, message ? message : "Not found", errors)
	}

	static Forbidden = (message, errors = []) => {
		return new ErrorHandler(403, message ? message : "Access denied", errors)
	}
}

export default ErrorHandler
