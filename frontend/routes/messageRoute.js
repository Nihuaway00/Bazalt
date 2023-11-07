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
		const { iv, encrypted } = await aes.encrypt(JSON.stringify({ chatID, value }))



		let encrypted_attach = []
		encrypted_attach = attachments?.map(async attachment => {
			const fileObj = { name: attachment.name, type: attachment.type, data: attachment.data.toString(), size: attachment.size }
			return await aes.encrypt(JSON.stringify(fileObj), iv)
		})

		Promise.all(encrypted_attach).then(arr => {
			const formData = new FormData()
			formData.append('encrypted', new Uint8Array(encrypted).toString())
			formData.append('iv', iv.toString())

			arr.map((enc, index) => {
				const fl = new File([enc.encrypted], attachments[index].name, {
					type: attachments[index].type
				})
				formData.append('attachments', fl)
			})

			$api.post(`${url}/message`, formData, {
				headers: {
					'Content-Type': "multipart/form-data; boundary=<calculated when request is sent>"
				}
			})
		})
	}

	static remove = async (messageID) => {
		return $api.get(`${url}/message/${messageID}/remove`)
	}
}

export default MessageRoute

//сделать перхватчик