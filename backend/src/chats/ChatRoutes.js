import { isAuthorized } from "#middlewares/authorizeMiddleware.js"
import { encryptData } from "#middlewares/cryptoMiddleware.js"
import { ChatService } from "#chats/chatService.js"
import multer from 'multer'
const upload = multer({ storage: multer.memoryStorage() })

export const ChatRoutes = (app, io) => {
	const Chat = new ChatService(io)

	// получение чата
	app.get(
		"/chat/:chat_id",
		isAuthorized,
		Chat.get,
		encryptData
	)

	// получение сообщений чата
	app.post(
		"/chat/:chat_id/messages",
		isAuthorized,
		Chat.getMessages,
		encryptData
	)

	// создание чата (общего)
	app.post("/chat", isAuthorized, Chat.create)

	// создание чата (личного)
	app.post("/chat/private", isAuthorized, Chat.createPrivate)

	// удаление чата
	app.get("/chat/:chat_id/remove", isAuthorized, Chat.remove)

	// приглашение в чат
	app.post(
		"/chat/:chat_id/member",
		isAuthorized,
		Chat.invite
	)

	// исключение из чата
	app.post(
		"/chat/:chat_id/member/kick",
		isAuthorized,
		Chat.kick
	)

	// выход из чата
	app.get(
		"/chat/:chat_id/leave",
		isAuthorized,
		Chat.leave
	)

	// изменение названия
	app.post("/chat/:chat_id/edit/title", isAuthorized, Chat.editTitle)

	//изменение аватарки
	app.post(
		"/chat/:chat_id/edit/avatar",
		isAuthorized,
		upload.single('avatar'),
		Chat.editAvatar
	)
}

