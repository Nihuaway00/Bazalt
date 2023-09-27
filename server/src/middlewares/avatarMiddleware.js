import sharp from "sharp"
import UserController from "#user/userController.js"
import AvatarController from "#avatar/avatarController.js"

const types = ["image/png", "image/jpeg", "image/jpg"]

const avatarMiddleware = async (req, res, next) => {
	try {
		const {userID} = req.session
		const avatar = req.file

		if (!userID || !avatar) throw new Error("Invalid input data")
		const userSnap = await UserController.getFromID(userID)
		if (!userSnap.exists()) throw new Error("User does not exist")
		if (!types.includes(avatar.mimetype)) throw new Error("This file format isn`t support")
		const image = await sharp(avatar.buffer)
		const metadata = await image.metadata()
		if (metadata.height < 564 || metadata.width < 564) throw new Error("This resolution is too low")

		const candidate = await AvatarController.getFromUserID(userID)
		if (candidate?.exists()) throw new Error("This user already has avatar")

		next()
	} catch (e) {
		console.log(e.message)
		res.status(500).send(e.message)
	}
}

export default avatarMiddleware