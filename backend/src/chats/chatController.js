import {
	query,
	getDocs,
	collection,
	doc,
	getDoc,
	setDoc,
	addDoc,
	deleteDoc,
	updateDoc,
} from "firebase/firestore"

import db from "#database/firebase.js"
import { chatConverter, Chat } from "#chats/chat.js"

class chatController {
	coll = collection(db, "chats").withConverter(chatConverter)

	getRef = async (chatID) => await doc(db, "chats", chatID).withConverter(chatConverter)

	createRef = async () => doc(db, "chats").withConverter(chatConverter)


	get = async (filters) => {
		const q = query(this.coll, ...filters).withConverter(chatConverter)
		const snaps = await getDocs(q)
		return snaps.docs
	}

	getFromID = async (chatID) => {
		const chatDoc = doc(this.coll, chatID)
		return await getDoc(chatDoc)
	}

	add = async (title, isPrivate, creatorID, key) => {
		const ref = await addDoc(this.coll, new Chat(title, isPrivate, null, creatorID, key))
		return await getDoc(ref)
	}

	set = async (chatRef, title, isPrivate) => {
		await setDoc(chatRef, new Chat(title, isPrivate))
	}

	update = async (chatID, update) => {
		const ref = await this.getRef(chatID)
		await updateDoc(ref, update)
	}

	delete = async (chatID) => {
		const chatRef = await this.getRef(chatID)
		await deleteDoc(chatRef)
	}
}

export default new chatController()