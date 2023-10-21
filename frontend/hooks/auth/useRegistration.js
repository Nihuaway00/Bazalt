import { useMutation } from "react-query"
import AuthRoute from "../../routes/authRoute"

export const useRegistration = () => {
	return useMutation(['registration'], ({ email, name, pass }) => AuthRoute.registration(email, name, pass))
}