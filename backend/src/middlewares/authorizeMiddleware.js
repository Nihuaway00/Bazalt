import ErrorHandler from "#errorHandler"

export const isAuthorized = (req, res, next) => {
    try {
        const { key } = req.session
        if (!key) throw ErrorHandler.Unauthorized()
        next()
    } catch (e) {
        next(e)
    }
}
