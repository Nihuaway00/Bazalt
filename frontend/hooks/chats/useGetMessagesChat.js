import { useMutation, useQuery } from "react-query"
import ChatRoute from "../../routes/chatRoute"
import { AesCryptoHandler } from "../../handlers/cryptoHandler"

export const useGetMessages = (chatID) => {
	return useMutation(['chat', chatID, 'messages',],
		async ({ timestamp, newest }) => {

			const res = await ChatRoute.getMessages(chatID, timestamp, newest)
			const aes = new AesCryptoHandler()
			await aes.generateKeyFromData('24', "salt")
			const decrypted = await aes.decrypt(
				new Uint8Array(res.data.encrypted.split(",")),
				new Uint8Array(res.data.iv.split(","))
			)
			res.data = JSON.parse(decrypted)
			return res
		},
		{

		}
	)
}