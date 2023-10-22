import { useMutation } from "react-query"
import ChatRoute from "../../routes/chatRoute"

export const useCreateChat = () => {
	return useMutation(['create chat'], async ({ title }) => await ChatRoute.create(title))
}