import { useMutation } from "react-query"
import MessageRoute from "../../routes/messageRoute"

export const useGetMessage = (messageID) => {
	return useMutation(['message', messageID], () => MessageRoute.get(messageID))
}