export class Chat {
	constructor(title, isPrivate, avatarID, creatorID, key) {
		this.title = title
		this.isPrivate = isPrivate
		this.avatarID = avatarID
		this.creatorID = creatorID
		this.key = key
	}

}

export const chatConverter = {
	toFirestore: (chat) => {
		return {
			title: chat.title,
			isPrivate: chat.isPrivate,
			avatarID: chat.avatarID,
			creatorID: chat.creatorID,
			key: chat.key
		}
	},
	fromFirestore: (snapshot, options) => {
		const data = snapshot.data(options)
		const exit = new Chat(data.title, data.isPrivate, data.avatarID, data.creatorID, data.key)
		exit._id = snapshot.id
		return exit
	}
}