import { collection, query, getDocs, addDoc, deleteDoc, where, updateDoc } from "firebase/firestore"
import db from "#database/firebase.js"
import { onlineConverter, Online } from "#online/online.js"

class OnlineController {
	coll = collection(db, "onlines").withConverter(onlineConverter)

	get = async (filters) => {
		if (!filters?.length) return
		const q = query(this.coll, ...filters).withConverter(onlineConverter)
		const snaps = await getDocs(q)
		return snaps.docs
	}

	getAll = async () => {
		const snaps = await getDocs(this.coll)
		return snaps.docs
	}

	getFromUserID = async (userID) => {
		if (!userID) return
		const onlineSnaps = await this.get([where("userID", "==", userID)])
		return onlineSnaps[0]
	}

	add = async (userID) => {
		if (!userID) return
		return await addDoc(this.coll, new Online(userID))
	}

	update = async (ref, update) => {
		if (!ref || !update) return
		return await updateDoc(ref, update)
	}

	delete = async (snap) => {
		if (!snap?.exists()) return
		await deleteDoc(snap.ref)
	}

	deleteFromUserID = async (userID) => {
		if (!userID) return
		const onlineSnap = await this.getFromUserID(userID)
		if (!onlineSnap?.exists()) return
		await deleteDoc(onlineSnap.ref)
	}
}

export default new OnlineController()