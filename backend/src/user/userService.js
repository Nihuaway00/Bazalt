import ErrorHandler from "#errorHandler"
import MemberController from "#members/memberController.js"
import UserController from "#user/userController.js"
import avatarController from "#avatar/avatarController.js"

export class UserService {
    static editName = async (req, res) => {
        try {
            const { userID } = req.session
            const { name } = req.body
            if (!name) throw ErrorHandler.BadRequest()

            const re = name.match(/[a-zA-Z0-9]*$/)
            if (!re)
                throw ErrorHandler.BadRequest(
                    "Name is have unsupported symbols"
                )

            await UserController.update(userID, { name })
            res.sendStatus(201)
        } catch (e) {
            console.log(e.message)
            res.status(500).send(e.message)
        }
    }

    static editAvatar = async (req, res) => {
        try {
            const avatar = req.file
            const { userID } = req.session

            if (!avatar) throw ErrorHandler.BadRequest()

            if (
                ![
                    "image/jpeg",
                    "image/jpg",
                    "image/png",
                    "image/webp",
                ].includes(avatar.mimetype)
            )
                throw ErrorHandler.BadRequest(
                    "The files contain an unsupported format"
                )
            if (avatar.size > 1048576)
                throw ErrorHandler.BadRequest(
                    "There is a huge file in files: " + file.size.toString()
                )

            const metadata = await ImageHandler.getMetadata(avatar.buffer)
            if (Math.min(metadata.width, metadata.height) < 100)
                throw ErrorHandler.BadRequest(
                    "Avatar has resolution less than 100px"
                )
            if (Math.max(metadata.width, metadata.height) > 2000)
                throw ErrorHandler.BadRequest(
                    "Avatar has too large resolution more then 2000px"
                )

            const avatarSnap = await avatarController.getFromUserID(userID)
            if (avatarSnap?.exists()) {
                await avatarController.delete(avatarSnap.id)
            }

            const newAvatarRef = await avatarController.createRef()
            fileHandler.uploadBuffer(
                "user.avatar",
                newAvatarRef.id,
                avatar.mimetype,
                avatar.buffer
            )
            const path = `user.avatar/${newAvatarRef.id}.${
                avatar.mimetype.split("/")[1]
            }`
            await avatarController.set(newAvatarRef, userID, path)

            res.send(201)
        } catch (e) {
            console.log(e.message)
            res.status(500).send(e.message)
        }
    }

    static editTag = async (req, res) => {
        try {
            const { userID } = req.session
            const { tag } = req.body
            if (!tag) throw ErrorHandler.BadRequest()

            const re = tag.match(/[a-zA-Z0-9]*$/)
            if (!re)
                throw ErrorHandler.BadRequest("Tag is have unsupported symbols")

            await UserController.update(userID, { tag })
            res.sendStatus(201)
        } catch (e) {
            console.log(e.message)
            res.status(500).send(e.message)
        }
    }

    static getChats = async (req, res) => {
        try {
            const { userID } = req.session
            const memberSnaps = await MemberController.getFromUserID(userID)
            res.send({ chatIDs: memberSnaps.map(snap => snap.data().chatID) })
        } catch (e) {
            console.log(e?.message)
            res.status(e?.status).send(e?.message)
        }
    }

    static getByTag = async (req, res) => {
        try {
            const { tag } = req.params
            if (!tag) throw ErrorHandler.BadRequest("Tag is undefined")
            const userSnap = await UserController.getFromTag(tag)
            res.send({ user: userSnap.data() })
        } catch (e) {
            console.log(e.message)
            res.status(500).send(e.message)
        }
    }
}
