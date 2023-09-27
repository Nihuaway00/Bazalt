class ChatAvatar {
	constructor(chatID, path) {
		this.chatID = chatID
		this.path = path
	}
}

const chatAvatarConverter = {
	toFirestore: (avatar) => {
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


const chatAvatarSizes = [140, 236, 564, 736, 1024, 1472]

export { ChatAvatar, chatAvatarConverter, chatAvatarSizes }
