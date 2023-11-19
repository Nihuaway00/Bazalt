import $api from "../axios"

const url = process.env.BACKEND_URL

class AuthRoute {
	static registration = async (email, name, pass) => {
		return await $api.post(`${url}/auth/registration`, { email, name, pass })
	}

	static login = async (email, pass, pubNum, decryptKeyJwk, HMACKeyJwk, G, P, publicNumSignatureEncrypted) => {
		return await $api.post(`${url}/auth/login`, { email, pass, pubNum, decryptKeyJwk, HMACKeyJwk, G, P, publicNumSignatureEncrypted })
	}

	static refresh = async () => {
		return await $api.get(`${url}/auth/refresh`)
	}

	static logout = async () => {
		return await $api.get(`${url}/auth/logout`)
	}

	static restore = async (email) => {
		return await $api.post(`${url}/auth/restore`, { email })
	}

	static restoreEnd = async (restore_token, newPassword) => {
		return await $api.post(`${url}/auth/restore/${restore_token}`, { newPassword })
	}
}

export default AuthRoute