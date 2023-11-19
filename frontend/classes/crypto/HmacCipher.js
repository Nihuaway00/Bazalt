const crypto = globalThis.crypto

export class HmacCryptoHandler {
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
