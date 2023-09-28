import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"
import { initializeApp } from "firebase/app"

initializeApp({
	"apiKey": "gfh45hrtkjtykt6t", //not valid apikey, but it works locally
	"projectId": "bazalt",
	"storageBucket": "bazalt",
})

const db = getFirestore()
connectFirestoreEmulator(db, "firebase", 8080)
export default db
