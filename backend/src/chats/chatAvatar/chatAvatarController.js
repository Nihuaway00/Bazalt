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
    where,
} from "firebase/firestore"
import db from "#database/firebase.js"
import {
    chatAvatarConverter,
    ChatAvatar,
} from "#chats/chatAvatar/chatAvatar.js"

class chatAvatarController {
    coll = collection(db, "chatAvatars").withConverter(chatAvatarConverter)

    getRef = async chatAvatarID =>
        doc(db, "chatAvatars", chatAvatarID).withConverter(chatAvatarConverter)

    createRef = async () => doc(this.coll).withConverter(chatAvatarConverter)

    get = async filters => {
        const q = query(this.coll, ...filters).withConverter(
            chatAvatarConverter
        )
        const snaps = await getDocs(q)
        return snaps.docs
    }

    getFromID = async chatAvatarID => {
        const chatAvatarDoc = doc(this.coll, chatAvatarID)
        return await getDoc(chatAvatarDoc)
    }

    getFromChatID = async chatID => {
        const q = query(this.coll, where("chatID", "==", chatID)).withConverter(
            chatAvatarConverter
        )
        const snaps = await getDocs(q)
        return snaps.docs[0]
    }

    add = async (chatID, path) => {
        const ref = await addDoc(this.coll, new ChatAvatar(chatID, path))
        return await getDoc(ref)
    }

    set = async (chatAvatarRef, chatID, path) => {
        await setDoc(chatAvatarRef, new ChatAvatar(chatID, path))
    }

    update = async (chatAvatarID, update) => {
        const ref = await this.getRef(chatAvatarID)
        await updateDoc(ref, update)
    }

    delete = async chatAvatarID => {
        const chatAvatarRef = await this.getRef(chatAvatarID)
        await deleteDoc(chatAvatarRef)
    }
}

export default new chatAvatarController()
