import { useMutation } from "react-query"
import ChatRoute from "../../routes/chatRoute"


export const useRemoveChat = (chatID) => {
	return useMutation(['remove chat', chatID], () => ChatRoute.remove)
}
