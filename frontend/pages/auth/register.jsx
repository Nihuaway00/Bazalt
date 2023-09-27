"use client"
import { Heading, Input, Stack, Text, InputGroup, InputLeftElement, InputRightElement, Button } from "@chakra-ui/react"
import { CheckIcon, CloseIcon, EmailIcon, LockIcon, StarIcon, WarningIcon } from "@chakra-ui/icons"
import { useEffect, useState } from "react"
import { validate } from "validate.js"
import { useRouter } from "next/router"

const RegisterPage = () => {
	const router = useRouter()

	const [email, setEmail] = useState("")
	const [pass1, setPass1] = useState("")
	const [pass2, setPass2] = useState("")

	const [isInvalidEmail, setInvalidEmail] = useState(undefined)
	const [isInvalidPass, setInvalidPass] = useState(undefined)

	useEffect(() => {
		setInvalidEmail(validate({ value: email }, { value: { email: true } }))
	}, [email])

	useEffect(() => {
		setInvalidPass(validate({ value: pass1 }, { value: { format: /(?=.*[0-9])(?=.*[a-z])[0-9a-zA-Z!@#$%^&*]{6,}/ } }))
	}, [pass1])


	const onRegistration = () => {
		//TODO: reg logic
	}

	return (
		<Stack spacing={8} align={"center"} padding={"16px"} margin="48px 0 0 0">
			<Stack align="center">
				<Heading size={"lg"}>Регистрация</Heading>
				<Text onClick={() => {
					router.push("/auth/login")
				}} fontSize={"md"}>Уже есть аккаунт?</Text>
			</Stack>
			<Stack spacing={2}>
				<InputGroup>
					<InputLeftElement>
						<EmailIcon />
					</InputLeftElement>
					<Input isInvalid={!!isInvalidEmail} onChange={(e) => setEmail(e.target.value)} isRequired={true} placeholder="Ваша почта" type="email" />
					<InputRightElement>
						{isInvalidEmail ? <WarningIcon /> : <CheckIcon />}
					</InputRightElement>
				</InputGroup>
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
			</Stack>
			<Button onClick={onRegistration}>Зарегистрироваться</Button>
		</Stack>
	)
}

export default RegisterPage