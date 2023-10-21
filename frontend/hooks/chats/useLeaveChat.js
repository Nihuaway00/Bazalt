import { useMutation } from "react-query"
import ChatRoute from "../../routes/chatRoute"

export const useLeave = (chatID) => {
	return useMutation(['leave chat', chatID], async () => await ChatRoute.leave(chatID))
}