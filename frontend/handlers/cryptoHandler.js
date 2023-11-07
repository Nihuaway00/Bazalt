const crypto = globalThis.crypto


class AesCryptoHandler {
	key

	constructor() { }

	generateKeyFromData = async (keyData, salt) => {
		const baseKey = await crypto.subtle.importKey(
			"raw",
			Buffer.from(keyData),
			"PBKDF2",
			false,
			["deriveKey"]
		)

		this.key = await crypto.subtle.deriveKey(
			{
				name: "PBKDF2",
				hash: "SHA-256",
				iterations: 10,
				salt: Buffer.from(salt),
			},
			baseKey,
			{
				name: "AES-GCM",
				length: 256,
			},
			true,
			["encrypt", "decrypt"]
		)
	}

	generateKey = async () => {
		this.key = await crypto.subtle.generateKey(
			{
				name: "AES-GCM",
				length: 256,
			},
			true,
			["encrypt", "decrypt"]
		)
	}

	encrypt = async (data, iv) => {
		if (!iv) iv = crypto.getRandomValues(new Uint8Array(16))
		const en = new TextEncoder()
		const encrypted = await crypto.subtle.encrypt(
			{
				name: "AES-GCM",
				iv,
			},
			this.key,
			en.encode(data)
		)
		return {
			encrypted,
			iv,
		}
	}

	decrypt = async (signature, iv) => {
		const dec = new TextDecoder()
		const decrypted = await crypto.subtle.decrypt(
			{
				name: "AES-GCM",
				iv,
			},
			this.key,
			signature
		)
		return dec.decode(decrypted)
	}

	exportKey = async (format = "jwk") => {
		return await crypto.subtle.exportKey(format, this.key)
	}

	importKey = async (format, keyData) => {
		this.key = await crypto.subtle.importKey(
			format,
			keyData,
			{
				name: "AES-GCM",
				length: 256,
			},
			true,
			["encrypt", "decrypt"]
		)
	}
}

class RsaCryptoHandler {
	encryptKey
	decryptKey

	generateKeys = async () => {
		const algo = {
			name: "RSA-OAEP",
			modulusLength: 2048,
			publicExponent: new Uint8Array([1, 0, 1]),
			hash: "SHA-256",
		}

		const { publicKey, privateKey } = await crypto.subtle.generateKey(algo, true, [
			"decrypt",
			"encrypt",
		])

		this.encryptKey = publicKey
		this.decryptKey = privateKey
	}

	encrypt = async (data) => {
		return await crypto.subtle.encrypt(
			{
				name: "RSA-OAEP",
			},
			this.encryptKey,
			// ec.encode(data)
			data
		)
	}

	decrypt = async (signature) => {
		const decrypted = await crypto.subtle.decrypt(
			{
				name: "RSA-OAEP",
			},
			this.decryptKey,
			signature
		)
		// return dec.decode(decrypted);
		return decrypted
	}

	export = async (format = "jwk") => {
		const decryptKeyJwk = await crypto.subtle.exportKey(format, this.decryptKey)
		const encryptKeyJwk = await crypto.subtle.exportKey(format, this.encryptKey)

		return { decryptKeyJwk, encryptKeyJwk }
	}

	importDecryptKey = async (format, keyData) => {
		this.decryptKey = await crypto.subtle.importKey(
			format,
			keyData,
			{ name: "RSA-OAEP", hash: "SHA-256" },
			true,
			["decrypt"]
		)
	}
}

class HmacCryptoHandler {
	key

	generateKey = async () => {
		const algo = {
			name: "HMAC",
			hash: "SHA-256",
		}

		const keyUsage = ["sign", "verify"]

		this.key = await crypto.subtle.generateKey(algo, true, keyUsage)
	}

	export = async (format = "jwk") => {
		return await crypto.subtle.exportKey(format, this.key)
	}

	import = async (format, keyData) => {
		this.key = await crypto.subtle.importKey(
			format,
			keyData,
			{
				name: "HMAC",
				hash: "SHA-256",
			},
			true,
			["sign", "verify"]
		)
	}

	sign = async (data) => {
		return await crypto.subtle.sign({
			name: "HMAC",
			hash: "SHA-256",
		}, this.key, data)
	}

	verify = async (signature, data) => {
		return await crypto.subtle.verify({
			name: "HMAC",
			hash: "SHA-256",
		}, this.key, signature, data)
	}
}

export { AesCryptoHandler, RsaCryptoHandler, HmacCryptoHandler }
