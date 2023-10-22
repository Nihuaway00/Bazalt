import MessageController from "#messages/messageController.js"
import MemberController from "#members/memberController.js"
import FileHandler from "#handlers/fileHandler.js"
import { AesCryptoHandler } from "#handlers/cryptoHandler.js"
import AttachmentController from "#attachment/attachmentController.js"
import chatController from "#chats/chatController.js"
import ErrorHandler from "#errorHandler"

class MessageService {
	io
	socket

	constructor(io) {
		this.io = io
		io.on("connection", socket => (this.socket = socket))
	}

	get = async (req, res, next) => {
		try {
			const { message_id } = req.params
			const { userID } = req.session

			if (!message_id) throw ErrorHandler.BadRequest()
			const messageSnap = await MessageController.getFromID(message_id)
			if (!messageSnap.exists()) throw ErrorHandler.NotFound()

			const memberSnap = await MemberController.getOne(
				userID,
				messageSnap.data().chatID
			)
			if (!memberSnap.exists()) throw ErrorHandler.Forbidden()

			const attachmentSnaps = await AttachmentController.getFromMessageID(
				message_id
			)

			const toEncrypt = JSON.stringify({
				message: memberSnap.data(),
				attachments: attachmentSnaps.map(snap => snap.data())
			})

			req.body = { toEncrypt }
			next()
		} catch (e) {
			console.log(e.message)
			res.status(e.status).send(e.message)
		}
	}

	send = async (req, res) => {
		try {
			const { userID } = req.session
			const attachments = req.files
			const { value, chatID } = req.body

			if (!value || !chatID) throw ErrorHandler.BadRequest()
			const chatSnap = await chatController.getFromID(chatID)
			if (!chatSnap.exists()) throw ErrorHandler.NotFound()
			const memberSnap = await MemberController.getOne(userID, chatID)
			if (!memberSnap.exists()) throw ErrorHandler.Forbidden()

			const messageSnap = await MessageController.add(
				chatID,
				userID,
				value,
				false,
				!!attachments?.length
			)

			attachments?.map(async attachment => {
				const ref = await AttachmentController.createRef()
				FileHandler.uploadBuffer(
					"attachments",
					`${ref.id}.${attachment.mimetype.split("/")[1]}`,
					attachment.size,
					{},
					attachment.buffer
				)

				await AttachmentController.set(
					ref,
					messageSnap.id,
					`attachments/${ref.id}.${attachment.mimetype.split("/")[1]}`
				)
			})

			const attacmentSnaps = await AttachmentController.getFromMessageID(
				messageSnap.id
			)
			const chatKeyJwk = chatSnap.data().key

			const aes = new AesCryptoHandler()
			await aes.importKey("jwk", chatKeyJwk)
			const { encrypted, iv } = await aes.encrypt(
				JSON.stringify({
					message: messageSnap.data(),
					attachments: attacmentSnaps.map(snap => snap.data())
				})
			)

			this.socket.to(chatID).emit("SERVER:message", {
				encrypted: new Uint8Array(encrypted).toString(),
				iv: iv.toString()
			})
			res.sendStatus(201)
		} catch (e) {
			console.log(e.message)
			res.status(e.status).send(e.message)
		}
	}

	remove = async (req, res) => {
		try {
			const { message_id } = req.params
			const { userID } = req.session

			if (!message_id) throw ErrorHandler.BadRequest()
			const messageSnap = await MessageController.getFromID(message_id)
			if (!messageSnap.exists()) throw ErrorHandler.NotFound()
			if (messageSnap.data().system) throw ErrorHandler.Forbidden()
			if (userID !== messageSnap.data().userID) throw ErrorHandler.Forbidden()

			const attachmentSnaps = await AttachmentController.getFromMessageID(
				message_id
			)

			FileHandler.removeMany(
				"attachments",
				attachmentSnaps.map(({ data }) => data().path.split("/", 2)[1])
			)

			attachmentSnaps.map(
				async ({ id }) => await AttachmentController.delete(id)
			)

			this.socket
				.to(messageSnap.data().chatID)
				.emit("SERVER:message/remove", { messageID: message_id })
			res.sendStatus(201)
		} catch (e) {
			console.log(e.message)
			res.status(500).send(e.message)
		}
	}
}

export default MessageService
