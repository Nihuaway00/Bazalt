import { useMutation } from "react-query"
import AuthRoute from "../../routes/authRoute"

export const useLogout = () => {
	return useMutation(['logout'], AuthRoute.logout)
}