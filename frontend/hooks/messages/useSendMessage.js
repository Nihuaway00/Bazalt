import { useMutation } from "react-query"
import MessageRoute from "../../routes/messageRoute"

export const useSendMessage = (chatID) => {
	return useMutation(['send message'], async (value, attachments) => await MessageRoute.send(chatID, value, attachments))
}