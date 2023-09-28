import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"
import { initializeApp } from "firebase/app"
import init from "../../firebase.init.js"


if (!init) {
	console.log("ERROR: firebase\nMESSAGE: config file not found \n")
	console.log("You should initialize firebase!")
	console.log("To do this you should add firebase.init.json to root dir")
	console.log("Where will the config")
	process.exit(1)
}


initializeApp(init)

const db = getFirestore()
connectFirestoreEmulator(db, "firebase", 8080)
export default db
