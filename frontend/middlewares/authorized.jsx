import { Heading } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { useSelector } from "react-redux"


const Authorized = ({ children, passUrls }) => {
	const user = useSelector(state => state.user)
	const router = useRouter()


	if (!user) {
		return (<Heading>Загрузка...</Heading>)
	}

	if (passUrls.filter(url => !!router.pathname.match(url)).length > 0) {
		return children
	}

	if (user.unauthorized) {
		return (<Heading>Авторизуйся блять.</Heading>)
	}

	return children
}

export default Authorized