import {
	collection,
	addDoc,
	where,
	query,
	getDocs,
	doc,
	deleteDoc,
	getDoc,
} from "firebase/firestore"

import db from "#database/firebase.js"
import { messageConverter, Message } from "#messages/message.js"
import ChatController from "#chats/chatController.js"

class MessageController {
	coll = collection(db, "messages").withConverter(messageConverter)

	get = async (filters) => {
		if (!filters?.length) throw new Error("Invalid input data")
		const q = query(this.coll, ...filters).withConverter(messageConverter)
		const snaps = await getDocs(q)
		return snaps.docs
	}

	getFromID = async (messageID) => {
		if (!messageID) throw new Error("Invalid input data")
		const messageDoc = doc(db, "messages", messageID)
		return await getDoc(messageDoc)
	}

	getFromUserID = async (userID) => {
		if (!userID) throw new Error("Invalid input data")
		return await this.get([where("userID", "==", userID)])
	}

	getFromChatID = async (chatID) => {
		if (!chatID) throw new Error("Invalid input data")
		return await this.get([where("chatID", "==", chatID)])
	}

	add = async (chatID, userID, value, system, hasAttachments) => {
		if (!chatID || !value) throw new Error("Invalid input data")
		const chatSnap = await ChatController.getFromID(chatID)
		if (!chatSnap.exists()) throw new Error("Chat in not exist")
		const messageRef = await addDoc(this.coll, new Message(chatID, userID, value, null, new Date(), null, system, hasAttachments))
		return await getDoc(messageRef)
	}

	editText = async (messageID, newText) => {
		if (!messageID || !newText) throw new Error("Invalid input data")
		const messageSnap = await getDoc(doc(db, "messages", messageID))
		if (!messageSnap.exists()) throw new Error("Message is not exist")
		return await getDoc(messageSnap.ref)
	}

	delete = async (messageID) => {
		if (!messageID) throw new Error("Invalid input data")
		const messageSnap = await this.getFromID(messageID)
		await deleteDoc(messageSnap.ref)
	}
}

export default new MessageController()