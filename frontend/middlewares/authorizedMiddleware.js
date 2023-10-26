import { Button, Heading, Link, Stack, Text } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { store } from "../store/store"
import { useSelector } from "react-redux"


const Authorized = ({ children }) => {
	const user = useSelector(state => state.user)
	const router = useRouter()

	if (router.pathname.match('/auth')) {
		return children
	}

	if (!user) {
		return (<Heading>Загрузка...</Heading>)
	}


	if (user.unauthorized) {
		return (
			<Stack align={'center'}>
				<Heading>Вам нужно войти в аккаунт</Heading>
				<Text>Без этого никак.</Text>
				<Link href="/auth/login">
					<Button>{'-> Страница входа'}</Button>
				</Link>
			</Stack>
		)
	}

	return children
}

export default Authorized