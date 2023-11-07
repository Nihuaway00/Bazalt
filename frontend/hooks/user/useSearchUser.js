import { useMutation } from "react-query"
import UserRoute from "../../routes/userRoute"

export const useSearchUser = (tag) => {
	return useMutation(['user', 'search', tag], () => UserRoute.search(tag))
}