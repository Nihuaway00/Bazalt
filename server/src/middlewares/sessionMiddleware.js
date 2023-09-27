import "dotenv/config"
import ErrorHandler from "#errorHandler"

class SessionMiddleware {
	static authorized = (req, res, next) => {
		try {
			const { userID, key } = req.session
			if (!userID || !key) throw ErrorHandler.Unauthorized()
		} catch (e) {
			next(e)
		}
	}
}

export default SessionMiddleware
