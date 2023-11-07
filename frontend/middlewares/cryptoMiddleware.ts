import { AesCryptoHandler } from "../handlers/cryptoHandler"


class CryptoMiddleware {
	iv: ArrayBuffer
	key: String = '24'
	salt: String = 'salt'

	constructor(iv: ArrayBuffer) {
		this.iv = iv
	}

	decrypt = async (encrypted: ArrayBuffer) => {

		const aes = new AesCryptoHandler()
		await aes.generateKeyFromData(this.key, this.salt)
		const decrypted = await aes.decrypt(
			new Uint8Array(encrypted),
			new Uint8Array(this.iv)
		)
		return JSON.parse(decrypted)
	}

	encrypt = async (data: Object) => {
		const aes = new AesCryptoHandler()
		await aes.generateKeyFromData(this.key, this.salt)
		return await aes.encrypt(JSON.stringify(data), this.iv)
	}
}

export default CryptoMiddleware