import crypto from "node:crypto"

export class RsaCryptoHandler {
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