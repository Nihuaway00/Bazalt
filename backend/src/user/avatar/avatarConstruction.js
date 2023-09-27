import AvatarService from "./avatarService"

class AvatarConstruction {
	add = async (req, res) => {
		try {
			const { userID } = req.session
			const avatar = req.file
			if (!userID || !avatar) throw new Error("Invalid input data")
			await AvatarService.add(userID, avatar)
			res.sendStatus(200)
		} catch (e) {
			console.log(e.message)
			res.status(500).send(e.message)
		}
	}

	edit = async (req, res) => {
		try {
			const { avatarID } = req.body
			const avatar = req.file

			if (!avatarID || !avatar) throw new Error("Invalid input data")
			await AvatarService.edit(avatarID, avatar)
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
			await AvatarService.delete(avatarID)
			res.sendStatus(200)
		} catch (e) {
			console.log(e.message)
			res.status(500).send(e.message)
		}
	}
}

export default new AvatarConstruction()
