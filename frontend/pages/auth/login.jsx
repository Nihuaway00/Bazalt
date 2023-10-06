"use client"
import { Heading, Input, Stack, Text, InputGroup, InputLeftElement, StackDivider, InputRightElement, Button, ModalContent } from "@chakra-ui/react"
import { Modal, ModalBody, ModalHeader, ModalFooter, ModalCloseButton, ModalOverlay } from "@chakra-ui/react"
import { CheckIcon, CloseIcon, EmailIcon, LockIcon, StarIcon, WarningIcon } from "@chakra-ui/icons"
import { useContext, useEffect, useState } from "react"
import { useRouter } from "next/router"
import AuthRoute from "../../routes/authRoute"
import { useDispatch, useSelector } from "react-redux"
import { set } from "../../store/slices/userSlice"


const RequestRestoreModal = () => {
	return (
		<Modal>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Отправить ссылку на восстановление пароля</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					email
				</ModalBody>
				<ModalFooter>
					<Button>Отправить</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}

const LoginPage = () => {
	const router = useRouter();
	const dispatch = useDispatch()
	const [email, setEmail] = useState("")
	const [pass, setPass] = useState("")
	const user = useSelector(state => state.user)
	const [restoreEmail, setRestoreEmail] = useState("")
	const [isOpenRestore, setOpenRestore] = useState(false)

	const onLogin = async () => {
		const { user, sessionID } = await AuthRoute.login(email, pass)
		dispatch(set(user))
		localStorage.setItem('sessionID', sessionID)

		router.push('/')
	}

	if (user && !user.unauthorized) {
		return (
			<Stack>
				<Heading>{user.name},</Heading>
				<Text>вы уже авторизованы</Text>
			</Stack>
		)
	}

	const onRequestRestore = () => {

	}

	return (
		<>
			<Stack spacing={8} align={"center"} padding={"16px"} margin="48px 0 0 0">
				<Stack align="center">
					<Heading size={"lg"}>Вход</Heading>
					<Text onClick={() => {
						router.push("/auth/register")
					}} fontSize={"md"}>Или регистрация</Text>
				</Stack>
				<Stack spacing={2}>
					<InputGroup>
						<InputLeftElement>
							<EmailIcon />
						</InputLeftElement>
						<Input value={email} onChange={(e) => setEmail(e.target.value)} isRequired={true} placeholder="Ваша почта" type="email" />

					</InputGroup>
					<InputGroup>
						<InputLeftElement>
							<LockIcon />
						</InputLeftElement>
						<Input value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Пароль" type="password" />
					</InputGroup>
				</Stack>
				<Stack direction={"row"} align={"center"} gap={"24px"} divider={<StackDivider borderColor='gray.200' />} justifyContent="space-between">
					<Text fontSize="sm" width={"min-content"} onClick={() => {
						//router.push("/auth/restore")
						setOpenRestore(true)
					}}>Забыли пароль?</Text>
					<Button onClick={onLogin}>Войти</Button>
				</Stack>
			</Stack>
			<Modal isOpen={isOpenRestore} onClose={() => setOpenRestore(false)}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Отправить ссылку на восстановление пароля</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<InputGroup>
							<InputLeftElement>
								<EmailIcon />
							</InputLeftElement>
							<Input onChange={(e) => setRestoreEmail(e.target.value)} isRequired={true} placeholder="Почта вашего аккаунта" type="email" />
						</InputGroup>
					</ModalBody>
					<ModalFooter justifyContent={"center"}>
						<Button>Отправить</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	)
}

export default LoginPage