import $api from "../axios"

const url = process.env.BACKEND_URL

class UserRoute {
	static editName = async (name) => {
		return await $api.post(`${url}/user/edit/name`, { name })
	}

	static editAvatar = async (avatar) => {
		const formData = new FormData()
		formData.append('avatar', avatar)
		return await $api.post(`${url}/user/edit/avatar`, formdata, {
			headers: {
				'Content-Type': "multipart/form-data; boundary=<calculated when request is sent>"
			}
		})
	}

	static editTag = async (tag) => {
		return await $api.post(`${url}/user/edit/tag`, { tag })
	}

	static getChats = async () => {
		return await $api.get(`${url}/users/chats`)
	}

	static getByTag = async (tag) => {
		return await $api.get(`${url}/user/tag/${tag}`)
	}
}

export default UserRoute