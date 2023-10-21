import $api from "../axios"

const url = process.env.BACKEND_URL

class ChatRoute {
	static create = async (title) => {
		return await $api.post(`${url}/chat`, {
			title
		})
	}

	static remove = async (chatID) => {
		return await $api.get(`${url}/chat/${chatID}/remove`)
	}

	static getMessages = async (timestamp, newest) => {
		return await $api.post(`${url}/chat/${chatID}/messages`, { timestamp, newest })
	}

	static invite = async (chatID, invitedID) => {
		return await $api.post(`${url}/chat/${chatID}/member`, {
			invitedID
		})
	}

	static leave = async (chatID, memberID) => {
		return await $api.get(`${url}/chat/${chatID}/member/memberID/leave`)
	}


	static get = async (chatID) => {
		return await $api.get(`${url}/chat/${chatID}`)
	}
}

export default ChatRoute