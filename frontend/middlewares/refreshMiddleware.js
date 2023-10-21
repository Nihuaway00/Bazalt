import { useDispatch } from "react-redux"
import { useRefresh } from "../hooks/auth/useRefresh"
import { useEffect } from "react"
import { setUser, unauthorized } from "../store/slices/userSlice"

export const RefreshMiddleware = ({ children }) => {
	const dispatch = useDispatch()
	const onRefresh = useRefresh()

	useEffect(() => {
		const sessionID = localStorage.getItem("sessionID")
		if (!sessionID) return

		onRefresh.mutate(undefined, {
			onSuccess: ({ data }) => {
				dispatch(setUser(data.user))
			},
			onError: (err) => {
				dispatch(unauthorized())
				alert('refresh:' + err.message)
			}
		})
	}, [])

	return children
}