import $api from "../axios"

const url = process.env.BACKEND_URL

class UserRoute {
	static getChats = async () => {
		try {
			const { data } = await $api.get(`${url}/user/chats`)
			return data
		} catch (e) {
			return e.message
		}
	}
}

export default UserRoute