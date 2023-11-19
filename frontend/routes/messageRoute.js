import $api from "../axios"
const url = process.env.BACKEND_URL
import { AesCryptoHandler } from "../classes/crypto/AesCipher"

class MessageRoute {
	static get = async (messageID) => {
		return $api.get(`${url}/message/${messageID}`)
	}

	static send = async (chatID, value) => {
		const key = localStorage.getItem('key')

		const aes = new AesCryptoHandler()
		await aes.generateKeyFromData(key.toString(), "salt")
		const { iv, encrypted } = await aes.encrypt(JSON.stringify({ chatID, value }))

		const formData = new FormData()
		formData.append('encrypted', new Uint8Array(encrypted).toString())
		formData.append('iv', iv.toString())

		$api.post(`${url}/message`, formData, {
			headers: {
				'Content-Type': "multipart/form-data; boundary=<calculated when request is sent>"
			}
		})
	}

	static remove = async (messageID) => {
		return $api.get(`${url}/message/${messageID}/remove`)
	}

	static edit = async (messageID, value) => {
		const key = localStorage.getItem('key')

		const aes = new AesCryptoHandler()
		await aes.generateKeyFromData(key.toString(), "salt")
		const { iv, encrypted } = await aes.encrypt(JSON.stringify({ value }))

		const formData = new FormData()
		formData.append('encrypted', new Uint8Array(encrypted).toString())
		formData.append('iv', iv.toString())

		return $api.post(`${url}/message/${messageID}/remove`, formData, {
			headers: {
				'Content-Type': "multipart/form-data; boundary=<calculated when request is sent>"
			}
		})
	}
}

export default MessageRoute