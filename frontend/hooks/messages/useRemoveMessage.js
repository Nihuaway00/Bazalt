import { useMutation } from "react-query"
import MessageRoute from "../../routes/messageRoute"

export const useRemoveMessage = (messageID) => {
	return useMutation(['remove message', messageID], () => MessageRoute.remove(messageID))
}