import { useMutation } from "react-query"
import ChatRoute from "../../routes/chatRoute"


export const useRemoveChat = (chatID) => {
	return useMutation(['chat', 'remove', chatID], () => ChatRoute.remove)
}
