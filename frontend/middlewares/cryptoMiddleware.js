import { AesCryptoHandler } from "../classes/crypto/AesCipher"

class CryptoMiddleware {
	iv
	key = '24'
	salt = 'salt'

	constructor(iv) {
		this.iv = iv
	}

	decrypt = async (encrypted) => {

		const aes = new AesCryptoHandler()
		await aes.generateKeyFromData(this.key, this.salt)
		const decrypted = await aes.decrypt(
			new Uint8Array(encrypted),
			new Uint8Array(this.iv)
		)
		return JSON.parse(decrypted)
	}

	encrypt = async (data) => {
		const aes = new AesCryptoHandler()
		await aes.generateKeyFromData(this.key, this.salt)
		return await aes.encrypt(JSON.stringify(data), this.iv)
	}
}

export default CryptoMiddleware