import SessionMiddleware from "#middlewares/authorizeMiddleware.js"
import CryptoMiddleware from "#middlewares/cryptoMiddleware.js"
import ChatService from "#chats/chatService.js"
import multer from 'multer'
const upload = multer({ storage: multer.memoryStorage() })

const ChatRoutes = (app, io) => {
	const Chat = new ChatService(io)

	// получение чата
	app.get(
		"/chat/:chat_id",
		SessionMiddleware.authorized,
		Chat.get,
		CryptoMiddleware.encrypt
	)

	// получение сообщений чата
	app.post(
		"/chat/:chat_id/messages",
		SessionMiddleware.authorized,
		Chat.getMessages,
		CryptoMiddleware.encrypt
	)

	// создание чата (общего)
	app.post("/chat", SessionMiddleware.authorized, Chat.create)

	// создание чата (личного)
	app.post("/chat/private", SessionMiddleware.authorized, Chat.createPrivate)

	// удаление чата
	app.get("/chat/:chat_id/remove", SessionMiddleware.authorized, Chat.remove)

	// приглашение в чат
	app.post(
		"/chat/:chat_id/member",
		SessionMiddleware.authorized,
		Chat.invite
	)

	// исключение из чата
	app.post(
		"/chat/:chat_id/member/kick",
		SessionMiddleware.authorized,
		Chat.kick
	)

	// выход из чата
	app.get(
		"/chat/:chat_id/leave",
		SessionMiddleware.authorized,
		Chat.leave
	)

	// изменение названия
	app.post("/chat/:chat_id/edit/title", SessionMiddleware.authorized, Chat.editTitle)

	//изменение аватарки
	app.post(
		"/chat/:chat_id/edit/avatar",
		SessionMiddleware.authorized,
		upload.single('avatar'),
		Chat.editAvatar
	)
}

export default ChatRoutes
