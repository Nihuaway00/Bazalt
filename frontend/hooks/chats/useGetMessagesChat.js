import { useMutation } from "react-query"
import ChatRoute from "../../routes/chatRoute"


export const useGetMessages = () => {
	return useMutation(['messages chat', chatID], async (timestamp, newest) => await ChatRoute.getMessages(timestamp, newest))
}