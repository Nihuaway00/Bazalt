import {
	query,
	getDocs,
	collection,
	doc,
	getDoc,
	setDoc,
	addDoc,
	where,
	deleteDoc,
	updateDoc,
} from "firebase/firestore"
import db from "#database/index.js"
import { attachmentConverter, Attachment } from "#attachment/attachment.js"

class attachmentController {
	coll = collection(db, "attachments").withConverter(attachmentConverter)

	getRef = async (attachmentID) =>
		doc(db, "attachments", attachmentID).withConverter(attachmentConverter)

	createRef = async () =>
		doc(this.coll).withConverter(attachmentConverter)

	get = async (filters) => {
		const q = query(this.coll, ...filters).withConverter(attachmentConverter)
		const snaps = await getDocs(q)
		return snaps.docs
	}

	getFromID = async (attachmentID) => {
		const attachmentDoc = doc(this.coll, attachmentID)
		return await getDoc(attachmentDoc)
	}

	getFromMessageID = async (messageID) => {
		const q = query(this.coll, where("messageID", "==", messageID)).withConverter(attachmentConverter)
		const snaps = await getDocs(q)
		return snaps.docs
	}
 
	add = async (messageID, path) => {
		const ref = await addDoc(this.coll, new Attachment(messageID, path))
		return await getDoc(ref)
	}

	set = async (attachmentRef, messageID, path) => {
		await setDoc(attachmentRef, new Attachment(messageID, path))
	}

	update = async (attachmentID, update) => {
		const ref = await this.getRef(attachmentID)
		await updateDoc(ref, update)
	}

	delete = async (attachmentID) => {
		const attachmentRef = await this.getRef(attachmentID)
		await deleteDoc(attachmentRef)
	}
}

export default new attachmentController()
