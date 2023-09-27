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
import { passwordConverter, Password } from "#password/password.js"

class passwordController {
	coll = collection(db, "passwords").withConverter(passwordConverter)

	get = async (filters) => {
		const q = query(this.coll, ...filters).withConverter(passwordConverter)
		const snaps = await getDocs(q)
		return snaps.docs
	}

	getFromUserID = async (userID) => {
		const q = query(this.coll, where("userID", "==", userID)).withConverter(passwordConverter)
		const snaps = await getDocs(q)
		return snaps.docs[0]
	}

	getFromID = async (passwordID) => {
		const passwordDoc = doc(this.coll, passwordID)
		return await getDoc(passwordDoc)
	}

	add = async (value, userID) => {
		const ref = await addDoc(
			this.coll,
			new Password(value, userID)
		)
		return await getDoc(ref)
	}

	set = async (passwordRef, value, userID) => {
		await setDoc(passwordRef, new Password(value, userID))
	}

	update = async (passwordID, update) => {
		const ref = await doc(db, "passwords", passwordID)
		await updateDoc(ref, update)
	}

	delete = async (passwordID) => {
		const passwordRef = doc(db, "passwords", passwordID)
		await deleteDoc(passwordRef)
	}

}

export default new passwordController()