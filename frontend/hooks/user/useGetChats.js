import { useMutation } from "react-query"
import UserRoute from "../../routes/userRoute"

export const useGetChat = () => {
	return useMutation(['chats'], () => UserRoute.getChats)
}