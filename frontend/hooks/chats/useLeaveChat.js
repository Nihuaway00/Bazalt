import { useMutation } from "react-query"
import ChatRoute from "../../routes/chatRoute"

export const useLeaveChat = (chatID) => {
	return useMutation(['chat', 'leave', chatID], async () => await ChatRoute.leave(chatID))
}