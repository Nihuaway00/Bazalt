import { useMutation } from "react-query"
import ChatRoute from "../../routes/chatRoute"

export const useGetChat = (chatID) => {
	return useMutation(['chat', chatID], async () => await ChatRoute.get(chatID))
}
