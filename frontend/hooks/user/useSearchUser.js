import { useMutation } from "react-query"
import UserRoute from "../../routes/userRoute"

export const useSearchUser = (tag) => {
	return useMutation(['search user', tag], () => UserRoute.search(tag))
}