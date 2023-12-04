import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"
import { initializeApp } from "firebase/app"

const host = process.env.FIREBASE_HOST
const port = process.env.FIREBASE_PORT

initializeApp({
    apiKey: "gfh45hrtkjtykt6t", //not valid apikey, but it works locally
    projectId: "bazalt",
    storageBucket: "bazalt",
})

const db = getFirestore()
connectFirestoreEmulator(db, host, port)
export default db
