import axios from "axios"

const $api = axios.create({
	headers: {
		"Content-Type": "application/json",
		Accept: "*/*",
	},
	withCredentials: true,
})

export default $api
