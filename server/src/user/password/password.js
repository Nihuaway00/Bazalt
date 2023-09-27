class Password {
	constructor(value, userID) {
		this.value = value
		this.userID = userID
	}
}

const passwordConverter = {
	toFirestore: (password) => {
		return {
			value: password.value,
			userID: password.userID
		}
	},
	fromFirestore: (snapshot, options) => {
		const data = snapshot.data(options)
		const exit = new Password(data.value, data.userID)
		exit._id = snapshot.id
		return exit
	}
}
export { Password, passwordConverter }