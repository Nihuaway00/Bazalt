import { CheckIcon, LockIcon, WarningIcon } from "@chakra-ui/icons"
import { Button, Heading, Input, InputGroup, InputLeftElement, InputRightElement, Stack, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { validate } from "validate.js"
import { useRouter } from "next/router"

const RestorePage = () => {
	const router = useRouter()
	const { restore_token } = router.query

	const [pass1, setPass1] = useState("")
	const [pass2, setPass2] = useState("")

	const [isInvalidPass, setInvalidPass] = useState(undefined)
	const [isChanged, setChanged] = useState(false)

	useEffect(() => {
		setInvalidPass(validate({ value: pass1 }, { value: { format: /(?=.*[0-9])(?=.*[a-z])[0-9a-zA-Z!@#$%^&*]{6,}/ } }))
	}, [pass1])
	return (
		<Stack spacing={8} align={"center"} padding={"16px"} margin="48px 0 0 0">
			<Heading size={"lg"}>{isChanged ? "Пароль изменен." : "Придумайте новый пароль"}</Heading>
			{isChanged || <Stack spacing={2}>
				<InputGroup>
					<InputLeftElement>
						<LockIcon />
					</InputLeftElement>
					<Input isInvalid={!!isInvalidPass} onChange={(e) => setPass1(e.target.value)} placeholder="Придумайте пароль" type="password" />
					<InputRightElement>
						{isInvalidPass ? <WarningIcon /> : <CheckIcon />}
					</InputRightElement>
				</InputGroup>
				<InputGroup>
					<InputLeftElement>
						<LockIcon />
					</InputLeftElement>
					<Input isInvalid={pass1 !== pass2} onChange={(e) => setPass2(e.target.value)} placeholder="И еще раз" type="password" />
					<InputRightElement>
						{pass1 !== pass2 ? <WarningIcon /> : <CheckIcon />}
					</InputRightElement>
				</InputGroup>
			</Stack>}
			<Button onClick={() => {
				if (isChanged) {
					router.push("/auth/login")
					return
				}

				if (!isInvalidPass && pass1 === pass2) {
					setChanged(true)
				}
			}}>{isChanged ? "На страницу входа" : "Изменить"}</Button>
		</Stack>
	)
}

export default RestorePage