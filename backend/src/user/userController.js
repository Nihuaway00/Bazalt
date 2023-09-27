
import { collection, query, where, getDocs, addDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import db from "#database/index.js"
import { userConverter, User } from "#user/user.js"

class UserController {
	coll = collection(db, "users").withConverter(userConverter)

	get = async (filters) => {
		const q = query(this.coll, ...filters)
		const snaps = await getDocs(q)
		return snaps.docs
	}

	getAll = async () => {
		const snaps = await getDocs(this.coll)
		return snaps.docs
	}

	getFromRestore = async (restore) => {
		const q = query(this.coll, where("restore", "==", restore))
		const snaps = await getDocs(q)
		return snaps.docs[0]
	}


	getFromEmail = async (email) => {
		const q = query(this.coll, where("email", "==", email))
		const snaps = await getDocs(q)
		return snaps.docs[0]
	}

	getFromID = async (userID) => {
		const ref = doc(db, "users", userID)
		return await getDoc(ref)
	}

	set = async (userID, data) => {
		const ref = await doc(db, "users", userID)
		return await setDoc(ref, data)
	}

	add = async (name, email) => {
		const data = new User(name, email, null, new Date(), null, false)
		const ref = await addDoc(this.coll, data)
		return await getDoc(ref)
	}

	update = async (userID, update) => {
		const ref = await doc(db, "users", userID)
		return await updateDoc(ref, update)
	}

	delete = async (userID) => {
		const ref = await doc(db, "users", userID)
		await updateDoc(ref, { deletedAt: new Date() })
		return await getDoc(ref)
	}
}

export default new UserController()