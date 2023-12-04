export class Member {
    constructor(chatID, userID, lastSeen, invitedBy, invitedAt) {
        this.chatID = chatID
        this.userID = userID
        this.lastSeen = lastSeen
        this.invitedBy = invitedBy
        this.invitedAt = invitedAt
    }
}

export const memberConverter = {
    toFirestore: member => {
        return {
            chatID: member.chatID,
            userID: member.userID,
            lastSeen: member.lastSeen,
            invitedBy: member.invitedBy,
            invitedAt: member.invitedAt,
        }
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options)
        const exit = new Member(
            data.chatID,
            data.userID,
            data.lastSeen,
            data.invitedBy,
            data.invitedAt
        )
        exit._id = snapshot.id
        return exit
    },
}
