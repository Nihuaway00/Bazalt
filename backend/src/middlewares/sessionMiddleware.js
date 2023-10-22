import "dotenv/config"
import ErrorHandler from "#errorHandler"

class SessionMiddleware {
	static authorized = (req, res, next) => {
		try {
			const { userID } = req.session
			if (!userID) throw ErrorHandler.Unauthorized()
			next()
		} catch (e) {
			next(e)
		}
	}
}

export default SessionMiddleware
