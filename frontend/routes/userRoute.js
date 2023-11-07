import $api from "../axios"

const url = process.env.BACKEND_URL

class UserRoute {
	static get = async (id) => {
		return await $api.get(`${url}/user/${id}`)
	}

	static getChats = async () => {
		return await $api.get(`${url}/users/chats`)
	}

	static search = async (tag) => {
		return await $api.get(`${url}/user/tag/${tag}`)
	}
}

export default UserRoute