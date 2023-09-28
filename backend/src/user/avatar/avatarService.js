import AvatarController from "#avatar/avatarController.js"
import FileFunction from "#functions/fileFunction.js"
import fs from "fs"
import sharp from "sharp"
import { avatarSizes } from "#avatar/avatar.js"

import ImageHandler from "#handlers/imageHandler.js"
import minio from "#handlers/fileHandler.js"

class AvatarService {
	get = async (req, res) => {
		try {
			const { size, userID } = req.body
			if (!userID || !avatarSizes.includes(parseInt(size))) throw new Error("Invalid input data")
			const avatarSnap = await AvatarController.getFromUserID(userID)
			if (!avatarSnap?.exists()) throw new Error("This user doesn`t has avatar")
			res.send({ path: `${process.env.URL + ":" + process.env.PORT}/${process.env.PATH_AVATARS}${size}x/${avatarSnap.data().path}` })
		} catch (e) {
			console.log(e.message)
			res.status(500).send(e.message)
		}
	}


	add = async (req, res) => {
		try {
			const { userID } = req.session
			const avatar = req.file

			const image = new ImageHandler(avatar.buffer)
			const buffer = await image.resize(120)
			await minio.uploadBuffer("images", "avatar.webp", buffer)

			res.sendStatus(200)
			return
			const avatarRef = await AvatarController.ref()
			const relativePath = FileFunction.path(avatarRef.id)

			avatarSizes.map(size => {
				fs.mkdirSync(`uploads/${process.env.PATH_AVATARS}${size}x/${relativePath.slice(0, 2)}/${relativePath.slice(2, 5)}`, { recursive: true })

				sharp(avatar.buffer)
					.resize(size, size)
					.webp()
					.toFile(`uploads/${process.env.PATH_AVATARS}${size}x/${relativePath}.webp`)
			})

			await AvatarController.set(avatarRef, userID, relativePath + ".webp")
			res.sendStatus(200)
		} catch (e) {
			console.log(e.message)
			res.status(500).send(e.message)
		}

	}

	delete = async (req, res) => {
		try {
			const { avatarID } = req.body

			if (!avatarID) throw new Error("Invalid input data")
			const avatarSnap = await AvatarController.getFromID(avatarID)
			if (!avatarSnap?.exists()) {
				res.sendStatus(200)
				return
			}

			const path = avatarSnap.data().path
			avatarSizes.map(size => {
				fs.unlinkSync(`uploads/${process.env.PATH_AVATARS}${size}x/${path}`)
				fs.rmSync(`uploads/${process.env.PATH_AVATARS}${size}x/${path.split("/")[0]}`, { recursive: true })
			})

			await AvatarController.delete(avatarID)
			res.sendStatus(200)
		} catch (e) {
			console.log(e.message)
			res.status(500).send(e.message)
		}
	}
}

export default new AvatarService()
