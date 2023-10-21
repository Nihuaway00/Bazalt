import { useMutation, useQuery } from "react-query"
import AuthRoute from "../../routes/authRoute"
import { useDispatch } from "react-redux"
import { setUser } from "../../store/slices/userSlice"
import { store } from "../../store/store"

export const useLogin = () => {
	return useMutation(['login'], async ({ email, pass }) => await AuthRoute.login(email, pass))
}