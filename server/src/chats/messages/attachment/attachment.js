class Attachment {
	constructor(messageID, path) {
		this.messageID = messageID
		this.path = path
	}
}

const attachmentConverter = {
	toFirestore: (attachment) => {
		return {
			messageID: attachment.messageID,
			path: attachment.path,
		}
	},
	fromFirestore: (snapshot, options) => {
		const data = snapshot.data(options)
		const exit = new Attachment(data.messageID, data.path)
		exit._id = snapshot.id
		return exit
	},
}

export { Attachment, attachmentConverter }
