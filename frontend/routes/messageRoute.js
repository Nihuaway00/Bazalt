import $api from "../axios"
const url = process.env.BACKEND_URL

class MessageRoute {
	static get = async (messageID) => {
		return $api.get(`${url}/message/${messageID}`)
	}

	static send = async (chatID, value, attachments) => {
		const formData = new FormData()
		formData.append('attachments', '')
		formData.append('value', '')
		formData.append('chatID', '')
		return $api.post(`${url}/message`, formData)
	}

	static remove = async (messageID) => {
		return $api.get(`${url}/message/${messageID}/remove`)
	}
}

export default MessageRoute