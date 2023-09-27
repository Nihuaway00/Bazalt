//controllers
import SessionController from "#session/sessionController.js"
import MemberController from "#members/memberController.js"

//routes
import MessageRoutes from "#messages/MessageRoutes.js"

import ChatRoutes from "#chats/ChatRoutes.js"
import AuthRoutes from "#auth/AuthRoutes.js"
import UserRoutes from "#user/UserRoutes.js"

const createRoutes = (app, io) => {
	const onSocketConnection = async (socket) => {
		try {
			//const socketSession = socket.handshake.session
			const sessionID = socket.handshake.headers.sessionid

			if (!sessionID) throw new Error("sessionID is undefined")

			const session = await SessionController.getFromID(sessionID)

			if (!session) throw new Error("session is undefined")
			const userID = session.userID

			//socket.handshake.session.socketID = socket.id
			//socket.handshake.session.sessionID = sessionID
			//socket.handshake.session.userID = userID
			//socket.handshake.session.save()

			//await SocketController.bindSession(sessionID, socketSession.id)

			//make this user is online
			console.log("connection", socket.id)

			const memberSnaps = await MemberController.getFromUserID(userID)
			memberSnaps.map((memberSnap) => {
				const chatID = memberSnap.data().chatID
				socket.join(chatID)
			})

			const onDisconnect = async () => {
				//make user if offline
				//socketSession.destroy(() => { })

				//const session = await SessionController.getFromID(sessionID)
				//if (!session) return
				//const userID = session.userID

				//const activeSocketIDs = await SocketController.getFromSessionID(
				//	sessionID
				//)
				//if (activeSocketIDs.length === 0) {
				//	await OnlineController.deleteFromUserID(userID)
				//	const userSnap = await UserController.getFromID(userID)
				//	await UserController.update(userSnap.ref, {
				//		enteredAt: new Date(),
				//	})
				//}

				//get all online users
				//const users = await getOnlineUsers()

				//console.log("disconnect", users)
				//io.emit("getUsers", users)
			}

			socket.on("disconnect", onDisconnect)
		} catch (e) {
			console.log(e.message)
			socket.disconnect()
		}
	}

	io.on("connection", onSocketConnection)

	AuthRoutes(app)
	ChatRoutes(app, io)
	MessageRoutes(app, io)
	UserRoutes(app)
}

export default createRoutes
