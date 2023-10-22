import SessionMiddleware from "#middlewares/sessionMiddleware.js"
import CryptoMiddleware from "#middlewares/cryptoMiddleware.js"
import ChatService from "#chats/chatService.js"

const ChatRoutes = (app, io) => {
	const Chat = new ChatService(io)

	app.get(
		"/chat/:chat_id",
		SessionMiddleware.authorized,
		Chat.get,
		CryptoMiddleware.encrypt
	)
	app.post(
		"/chat/:chat_id/messages",
		SessionMiddleware.authorized,
		Chat.getMessages,
		CryptoMiddleware.encrypt
	)
	//   app.get("/user/chats", SessionMiddleware.authorized, Chat.getChatIDs)

	app.post("/chat", SessionMiddleware.authorized, Chat.create)
	app.get("/chat/:chat_id/remove", SessionMiddleware.authorized, Chat.remove)
	//   app.post("/chat/:chat_id/title", SessionMiddleware.authorized, Chat.editTitle)
	//   app.post(
	//     "/chat/:chat_id/avatar",
	//     SessionMiddleware.authorized,
	//     Chat.addAvatar
	//   )
	//   app.get(
	//     "/chat/:chat_id/avatar/remove",
	//     SessionMiddleware.authorized,
	//     Chat.removeAvatar
	//   )
	app.post(
		"/chat/:chat_id/member",
		SessionMiddleware.authorized,
		Chat.invite
	)
	app.get(
		"/chat/:chat_id/leave",
		SessionMiddleware.authorized,
		Chat.leave
	)
	//   app.get(
	//     "/chat/:chat_id/member/:member_id/leave",
	//     SessionMiddleware.authorized,
	//     Chat.removeMember
	//   )
	//   app.get(
	//     "/chat/:chat_id/member/:member_id/upgrade",
	//     SessionMiddleware.authorized,
	//     Chat.upgradeMember
	//   )
	//   app.get(
	//     "/chat/:chat_id/member/:member_id/downgrade",
	//     SessionMiddleware.authorized,
	//     Chat.downgradeMember
	//   )
}

export default ChatRoutes
