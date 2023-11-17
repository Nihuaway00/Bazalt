export class Avatar {
	constructor(userID, path, uploadedAt) {
		this.userID = userID
		this.path = path
		this.uploadedAt = uploadedAt
	}
}

export const avatarConverter = {
	toFirestore: (avatar) => {
		return {
			userID: avatar.userID,
			path: avatar.path,
			uploadedAt: avatar.uploadedAt,
		}
	},
	fromFirestore: (snapshot, options) => {
		const data = snapshot.data(options)
		const exit = new Avatar(data.userID, data.path, data.uploadedAt)
		exit._id = snapshot.id
		return exit
	},
}
