import ErrorHandler from "#errorHandler"


export const isAuthorized = (req, res, next) => {
	try {
		const { userID } = req.session
		if (!userID) throw ErrorHandler.Unauthorized()
		next()
	} catch (e) {
		next(e)
	}
}