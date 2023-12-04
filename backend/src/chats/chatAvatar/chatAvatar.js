export class ChatAvatar {
    constructor(chatID, path) {
        this.chatID = chatID
        this.path = path
    }
}

export const chatAvatarConverter = {
    toFirestore: avatar => {
        return {
            chatID: avatar.chatID,
            path: avatar.path,
        }
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options)
        const exit = new ChatAvatar(data.chatID, data.path)
        exit._id = snapshot.id
        return exit
    },
}
