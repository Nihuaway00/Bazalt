import $api from "../axios"

const url = process.env.BACKEND_URL

class ChatRoute {

	static get = async (chatID) => {
		return await $api.get(`${url}/chat/${chatID}`)
	}

	static getMessages = async (chatID, timestamp, newest) => {
		return await $api.post(`${url}/chat/` + chatID + '/messages', { timestamp, newest })
	}

	static create = async (title) => {
		return await $api.post(`${url}/chat`, {
			title
		})
	}

	static createPrivate = async (second_user_id) => {
		return await $api.post(`${url}/chat`, {
			second_user_id
		})
	}

	static remove = async (chatID) => {
		return await $api.get(`${url}/chat/${chatID}/remove`)
	}

	static invite = async (chatID, invitedID) => {
		return await $api.post(`${url}/chat/${chatID}/member`, {
			invitedID
		})
	}

	static kick = async (chatID, to_kick_id) => {
		return await $api.post(`${url}/chat/${chatID}/member/kick`, { to_kick_id })
	}

	static leave = async (chatID) => {
		return await $api.get(`${url}/chat/${chatID}/leave`)
	}

	static editTitle = async (chatID, title) => {
		return await $api.post(`${url}/chat/${chatID}/edit/title`, { title })
	}

	static editAvatar = async (chatID, avatar) => {
		const formData = new FormData()
		formData.append('avatar', avatar)
		return await $api.post(`${url}/chat/${chatID}/edit/avatar`, formData, {
			headers: {
				'Content-Type': "multipart/form-data; boundary=<calculated when request is sent>"
			}
		})
	}

}

export default ChatRoute