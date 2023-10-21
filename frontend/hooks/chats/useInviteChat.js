import { useMutation } from "react-query"
import ChatRoute from "../../routes/chatRoute"


export const useInvite = (chatID) => {
	return useMutation(['invite chat', chatID], async (invitedID) => await ChatRoute.invite(invitedID))
}
