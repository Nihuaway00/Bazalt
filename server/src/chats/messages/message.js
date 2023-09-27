class Message {
	constructor(
		chatID,
		userID,
		value,
		isReplyTo,
		sentAt,
		editAt,
		system,
		hasAttachments
	) {
		this.system = system
		this.userID = userID
		this.chatID = chatID
		this.sentAt = sentAt
		this.hasAttachments = hasAttachments
		this.value = value
		this.isReplyTo = isReplyTo
		this.editAt = editAt
	}
}
const messageConverter = {
	toFirestore: (message) => {
		return {
			system: message.system,
			userID: message.userID,
			chatID: message.chatID,
			sentAt: message.sentAt,
			hasAttachments: message.hasAttachments,
			value: message.value,
			isReplyTo: message.isReplyTo,
			editAt: message.editAt,
		}
	},
	fromFirestore: (snapshot, options) => {
		const data = snapshot.data(options)
		const exit = new Message(
			data.chatID,
			data.userID,
			data.value,
			data.isReplyTo,
			data.sentAt,
			data.editAt,
			data.system,
			data.hasAttachments
		)
		exit._id = snapshot.id
		return exit
	},
}

export { Message, messageConverter }
