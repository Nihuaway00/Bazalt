export class Message {
	constructor(
		chatID,
		userID,
		value,
		sentAt,
		editAt,
		system,
	) {
		this.system = system
		this.userID = userID
		this.chatID = chatID
		this.sentAt = sentAt
		this.value = value
		this.editAt = editAt
	}
}
export const messageConverter = {
	toFirestore: (message) => {
		return {
			system: message.system,
			userID: message.userID,
			chatID: message.chatID,
			sentAt: message.sentAt,
			value: message.value,
			editAt: message.editAt,
		}
	},
	fromFirestore: (snapshot, options) => {
		const data = snapshot.data(options)
		const exit = new Message(
			data.chatID,
			data.userID,
			data.value,
			data.sentAt,
			data.editAt,
			data.system,
		)
		exit._id = snapshot.id
		return exit
	},
}