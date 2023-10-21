import { useMutation } from "react-query"
import AuthRoute from "../../routes/authRoute"

export const useRefresh = () => {
	return useMutation(['refresh'], AuthRoute.refresh)
}