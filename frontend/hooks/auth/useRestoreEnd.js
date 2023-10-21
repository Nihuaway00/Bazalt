import { useMutation } from "react-query"
import AuthRoute from "../../routes/authRoute"

export const useRestoreEnd = () => {
	return useMutation(['restore end'], async ({ pass, restore_token }) => await AuthRoute.restoreEnd(restore_token, pass))
}