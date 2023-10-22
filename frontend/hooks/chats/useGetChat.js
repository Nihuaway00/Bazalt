import { useMutation, useQuery } from "react-query"
import ChatRoute from "../../routes/chatRoute"
import { async } from "validate.js"
import { AesCryptoHandler } from "../../handlers/cryptoHandler"

export const useGetChat = (chatID) => {
	return useQuery(['chat', chatID], async () => {
		const res = await ChatRoute.get(chatID)
		const aes = new AesCryptoHandler()
		await aes.generateKeyFromData('24', "salt")
		const decrypted = await aes.decrypt(
			new Uint8Array(res.data.encrypted.split(",")),
			new Uint8Array(res.data.iv.split(","))
		)
		res.data = JSON.parse(decrypted)
		return res
	}, {
		select: ({ data }) => data,
		enabled: !!chatID
	})
}
