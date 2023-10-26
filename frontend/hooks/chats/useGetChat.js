import { useMutation, useQuery } from "react-query"
import ChatRoute from "../../routes/chatRoute"
import { async } from "validate.js"
import { AesCryptoHandler } from "../../handlers/cryptoHandler"
import { store } from "../../store/store"
import { addChatKeyAction, setChatKeyAction } from "../../store/slices/chatKeySlice"

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

		store.dispatch(setChatKeyAction(res.data.chat._id, res.data.chat.key))

		return res
	}, {
		select: ({ data }) => data,
		enabled: !!chatID
	})
}
