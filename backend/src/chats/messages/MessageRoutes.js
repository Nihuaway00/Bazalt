import SessionMiddleware from "#middlewares/sessionMiddleware.js"
import MessageService from "#messages/messageService.js"
import multer from "multer"
import FileMiddleware from "#middlewares/fileMiddleware.js"
import CryptoMiddleware from "#middlewares/cryptoMiddleware.js"

const upload = multer({ storage: multer.memoryStorage() })

const MessageRoutes = (app, io) => {
	const Message = new MessageService(io)

	app.post("/message/:message_id", SessionMiddleware.authorized, Message.get, CryptoMiddleware.encrypt)
	app.post(
		"/message",
		SessionMiddleware.authorized,
		upload.array("attachments", 10),
		FileMiddleware.decrypt,
		FileMiddleware.check,
		CryptoMiddleware.decrypt,
		Message.send
	)
	app.get("/message/:message_id/remove", SessionMiddleware.authorized, Message.remove)
}

export default MessageRoutes
