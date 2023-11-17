export class Online {
	constructor(userID) {
		this.userID = userID
	}

}

export const onlineConverter = {
	toFirestore: (online) => {
		return {
			userID: online.userID,
		}
	},
	fromFirestore: (snapshot, options) => {
		const data = snapshot.data(options)
		const exit = new Online(data.userID)
		exit._id = snapshot.id
		return exit
	}
}