import { useDispatch, useSelector } from "react-redux"
import { useRefresh } from "../../hooks/auth/useRefresh"
import { useEffect } from "react"
import { setUser, unauthorized } from "../../store/slices/userSlice"
import { Button, Heading, Link, Stack } from "@chakra-ui/react"
import { useRouter } from "next/router"

const RefreshPage = () => {
	const router = useRouter()
	const dispatch = useDispatch()
	const onRefresh = useRefresh()

	const user = useSelector(state => state.user)

	useEffect(() => {
		console.log(user);
	}, [user])

	useEffect(() => {
		const sessionID = localStorage.getItem("sessionID")
		if (!sessionID) return

		onRefresh.mutate(undefined, {
			onSuccess: ({ data }) => {
				dispatch(setUser(data.user))
				localStorage.setItem('sessionID', data.sessionID)
				router.push('/')
			},
			onError: (err) => {
				dispatch(unauthorized())
				localStorage.removeItem('sessionID')
				alert('refresh:' + err.message)
			}
		})
	}, [])

	return (
		<Stack>
			<Heading>
				Refersh: {onRefresh.isSuccess.toString()}
			</Heading>
			<Link href={onRefresh.isSuccess ? '/' : '/auth/login'}>
				<Button width='min-content'>{onRefresh.isSuccess ? '-> Home' : '-> Login'}</Button>
			</Link>
		</Stack>

	)
}

export default RefreshPage