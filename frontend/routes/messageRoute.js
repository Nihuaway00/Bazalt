import $api from "../axios"
const url = process.env.BACKEND_URL
import { AesCryptoHandler } from "../handlers/cryptoHandler"

class MessageRoute {
	static get = async (messageID) => {
		return $api.get(`${url}/message/${messageID}`)
	}

	static send = async (chatID, value, attachments) => {
		const key = 24 // localStorage.getItem('key')

		const aes = new AesCryptoHandler()
		await aes.generateKeyFromData(key.toString(), "salt")
		console.log(JSON.stringify({ chatID, value }));
		const { iv, encrypted } = await aes.encrypt(JSON.stringify({ chatID, value }))
		console.log(iv, encrypted);
		const formData = new FormData()
		formData.append('iv', iv.toString())
		formData.append('encrypted', new Uint8Array(encrypted).toString())

		return $api.post(`${url}/message`, formData)
	}

	static remove = async (messageID) => {
		return $api.get(`${url}/message/${messageID}/remove`)
	}
}

export default MessageRoute