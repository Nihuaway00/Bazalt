
import UserController from "#user/userController.js"
import OnlineController from "#online/onlineController.js"


const getOnlineUsers = async () => {
	const allUserSnaps = await UserController.getAll()
	const allOnlineUserSnaps = await OnlineController.getAll()

	return allUserSnaps.map(user => {
		if (allOnlineUserSnaps.filter(on => on.data().userID === user.id).length > 0) {
			return user.id
		}
		const date = user.data().enteredAt
		const nowDate = new Date()
		if (date) return `--- ${Math.round((nowDate - date.toDate()) / 1000)} секунд назад`
		return "--- давно"
	})
}

export {getOnlineUsers}