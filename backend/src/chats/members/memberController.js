import {
    collection,
    query,
    getDocs,
    doc,
    getDoc,
    addDoc,
    setDoc,
    deleteDoc,
    where,
} from "firebase/firestore"
import db from "#database/firebase.js"
import { memberConverter, Member } from "#members/member.js"

class MemberController {
    coll = collection(db, "members").withConverter(memberConverter)

    get = async filters => {
        if (!filters?.length) return
        const q = query(this.coll, ...filters).withConverter(memberConverter)
        const snaps = await getDocs(q)
        return snaps.docs
    }

    getOne = async (userID, chatID) => {
        if (!userID || !chatID) return
        const q = query(
            this.coll,
            where("userID", "==", userID),
            where("chatID", "==", chatID)
        ).withConverter(memberConverter)
        const snaps = await getDocs(q)
        return snaps.docs[0]
    }

    getFromID = async memberID => {
        if (!memberID) return
        const memberDoc = doc(this.coll, memberID)
        return await getDoc(memberDoc)
    }

    getFromChatID = async chatID => {
        if (!chatID) return
        const q = query(this.coll, where("chatID", "==", chatID)).withConverter(
            memberConverter
        )
        const snaps = await getDocs(q)
        return snaps.docs
    }

    getFromUserID = async userID => {
        if (!userID) return
        const q = query(this.coll, where("userID", "==", userID)).withConverter(
            memberConverter
        )
        const snaps = await getDocs(q)
        return snaps.docs
    }

    add = async (chatID, userID, invitedBy) => {
        if (!chatID || !userID) return
        const ref = await addDoc(
            this.coll,
            new Member(chatID, userID, new Date(), invitedBy, new Date())
        )
        return await getDoc(ref)
    }

    set = async (memberID, update) => {
        if (!memberID || !update) return
        const memberDoc = doc(db, this.coll, memberID)
        return await setDoc(memberDoc, update)
    }

    delete = async memberID => {
        if (!memberID) return
        const chatSnap = await this.getFromID(memberID)
        await deleteDoc(chatSnap.ref)
    }
}

export default new MemberController()
