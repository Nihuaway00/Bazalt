const ownerMiddleware = async (req, res, next) => {
	try {
		const {userID} = req.body
		const session = req.session

		if(userID !== session.userID){
			res.sendStatus(203)
			console.log("permission error")
			return
		}

		next()

	} catch (e) {
		next(e)
		res.sendStatus(202)
		console.log(e.message)
	}
}

export default ownerMiddleware