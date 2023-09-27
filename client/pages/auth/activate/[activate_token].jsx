import { CheckIcon, LockIcon, WarningIcon } from "@chakra-ui/icons"
import { Button, Heading, Input, InputGroup, InputLeftElement, InputRightElement, Stack, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { validate } from "validate.js"
import { useRouter } from "next/router"

const ActivatePage = () => {
	const router = useRouter()
	const { activate_token } = router.query

	return (
		<Stack spacing={8} align={"center"} padding={"16px"} margin="48px 0 0 0">
			<Heading size={"lg"}>Ваш аккаунт активирован</Heading>
			<Button onClick={() => router.push("/auth/login")}>Хорошо, на страницу входа</Button>
		</Stack>
	)
}

export default ActivatePage