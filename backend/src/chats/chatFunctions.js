import { where, limit } from "firebase/firestore"
import MemberController from "#members/memberController.js"
import MessageController from "#messages/messageController.js"

class ChatFunctions {
	getUnreadChats = async (userID) => {
		const memberSnaps = await MemberController.getFromUserID(userID)
		return await memberSnaps.filter(async (memberSnap) => {
			const { chatID, lastSeen } = memberSnap.data()

			if (!lastSeen) {
				const messageCandidate = await MessageController.get([
					where("chatID", "==", chatID),
					limit(1),
				])
				return !!messageCandidate[0]?.exists()
			}

			const unreadMessageSnaps = await MessageController.get([
				where("chatID", "==", chatID),
				where("time", ">", lastSeen),
			])

			return unreadMessageSnaps.length > 0
		})
	}

	getUnreadMessages = async (memberID) => {
		const memberSnap = await MemberController.getFromID(memberID)
		const { chatID, lastSeen } = memberSnap.data()

		if (!lastSeen) {
			const messageSnaps = await MessageController.get([
				where("chatID", "==", chatID),
			])
			return messageSnaps
		}

		const unreadMessageSnaps = await MessageController.get([
			where("chatID", "==", chatID),
			where("time", ">", lastSeen),
		])

		return unreadMessageSnaps
	}
}

export default new ChatFunctions()
