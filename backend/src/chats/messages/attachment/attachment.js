class Attachment {
	constructor(messageID, path, filename) {
		this.messageID = messageID
		this.path = path
		this.filename = filename
	}
}

const attachmentConverter = {
	toFirestore: (attachment) => {
		return {
			messageID: attachment.messageID,
			path: attachment.path,
			filename: attachment.filename
		}
	},
	fromFirestore: (snapshot, options) => {
		const data = snapshot.data(options)
		const exit = new Attachment(data.messageID, data.path, data.filename)
		exit._id = snapshot.id
		return exit
	},
}

export { Attachment, attachmentConverter }
