import axios from "axios"

const $api = axios.create({
	headers: {
		"Content-Type": "application/json",
		Accept: "*/*",
	},
	withCredentials: true,
})

$api.interceptors.response.use((res) => {
	return res
}, (err) => {
	return Promise.reject(err)
})

export default $api
