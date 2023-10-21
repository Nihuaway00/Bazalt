import $api from "../axios"

const url = process.env.BACKEND_URL

class UserRoute {
	static getChats = async () => {
		return await $api.get(`${url}/user/chats`)
	}

	static search = async (tag) => {
		return await $api.get(`${url}/user/${tag}`)
	}
}

export default UserRoute