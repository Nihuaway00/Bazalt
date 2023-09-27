

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
import { avatarConverter, Avatar } from "#avatar/avatar.js"

class AvatarController {
	coll = collection(db, "avatars").withConverter(avatarConverter)

	get = async (filters) => {
		if (!filters?.length) return
		const q = query(this.coll, ...filters).withConverter(avatarConverter)
		const snaps = await getDocs(q)
		return snaps.docs
	}

	ref = async () => doc(this.coll).withConverter(avatarConverter)

	getFromID = async (avatarID) => {
		if (!avatarID) return
		const chatDoc = doc(this.coll, avatarID)
		return await getDoc(chatDoc)
	}

	getFromUserID = async (userID) => {
		if (!userID) return
		const avatarSnaps = await this.get([where("userID", "==", userID)])
		return avatarSnaps[0]
	}

	edit = async (avatarID) => {
		const avatarSnap = await this.getFromID(avatarID)
		if (!avatarSnap.exists()) throw new Error("Avatar is not exist")
		await updateDoc(avatarSnap.ref, { uploadAt: new Date() })
		return await getDoc(avatarSnap.ref)
	}

	add = async (userID, path) => {
		const ref = await addDoc(this.coll, new Avatar(userID, path, new Date()))
		return await getDoc(ref)
	}

	set = async (avatarRef, userID, path) => {
		await setDoc(avatarRef, new Avatar(userID, path, new Date()))
	}

	delete = async (avatarID) => {
		if (!avatarID) return
		const avatarSnap = await this.getFromID(avatarID)
		await deleteDoc(avatarSnap.ref)
	}
}

export default new AvatarController()
