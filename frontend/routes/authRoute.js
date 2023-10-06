import $api from "../axios"

const url = process.env.BACKEND_URL

class AuthRoute {
	static registration = async (email, name, pass) => {
		try {
			const { data } = await $api.post(`${url}/auth/registration`, { email, name, pass })
			return data
		}
		catch (e) {
			return e.message
		}
	}

	static login = async (email, pass) => {
		try {
			const { data } = await $api.post(`${url}/auth/login`, { email, pass })
			return data
		}
		catch (e) {
			return e.message
		}
	}

	static refresh = async () => {
		try {
			const { data } = await $api.get(`${url}/auth/refresh`)
			return data
		} catch (e) {
			throw e
		}
	}
}

export default AuthRoute