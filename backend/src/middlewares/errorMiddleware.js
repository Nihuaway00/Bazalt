import ErrorHandler from "#errorHandler"

const errorMiddlware = (req, res, err) => {
	if (err instanceof ErrorHandler) {
		return res.status(err.status).json({ message: err.message, errors: err.errors })
	}
	return res.status(500).json({ message: "Uncatched error" })
}

export default errorMiddlware