
import SessionController from "#session/sessionController.js"
import SocketController from "#socket/socketController.js"

class SessionFunction{
	deleteFromUserID = async (userID, session_to_save) => {
		const session_ids = await SessionController.getFromUserID(userID)
		session_ids.map(async session_id => {
			if(session_to_save && session_id === session_to_save) return
			await SessionController.delete(session_id)

			const socket_ids = await SocketController.getFromSessionID(session_id)
			socket_ids.map(async socket_id => {
				await SocketController.delete(socket_id)
			})
		})
	}
}

export default new SessionFunction()