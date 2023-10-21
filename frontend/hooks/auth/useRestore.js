import { useMutation } from "react-query"
import AuthRoute from "../../routes/authRoute"

export const useRestore = () => {
	return useMutation(['restore'], async ({ email }) => await AuthRoute.restore(email))
}