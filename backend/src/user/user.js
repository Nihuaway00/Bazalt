class User {
	constructor(name, email, enteredAt, createdAt, activated) {
		this.name = name
		this.email = email
		this.createdAt = createdAt
		this.enteredAt = enteredAt
		this.activated = activated
	}
}

const userConverter = {
	toFirestore: (user) => {
		return {
			name: user.name,
			email: user.email,
			createdAt: user.createdAt,
			enteredAt: user.enteredAt,
			activated: user.activated,
		}
	},
	fromFirestore: (snapshot, options) => {
		const data = snapshot.data(options)
		const exit = new User(data.name, data.email, data.createdAt, data.enteredAt, data.activated)
		exit._id = snapshot.id
		return exit
	},
}
export { User, userConverter }
