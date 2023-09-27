"use client"
import { Heading, Input, Stack, Text, InputGroup, InputLeftElement, StackDivider, InputRightElement, Button, ModalContent } from "@chakra-ui/react"
import { Modal, ModalBody, ModalHeader, ModalFooter, ModalCloseButton, ModalOverlay } from "@chakra-ui/react"
import { CheckIcon, CloseIcon, EmailIcon, LockIcon, StarIcon, WarningIcon } from "@chakra-ui/icons"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"


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
	const router = useRouter()
	const [email, setEmail] = useState("")
	const [pass, setPass] = useState("")

	const [restoreEmail, setRestoreEmail] = useState("")
	const [isOpenRestore, setOpenRestore] = useState(false)

	const onLogin = () => {
		//TODO: login logic
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
						<Input onChange={(e) => setEmail(e.target.value)} isRequired={true} placeholder="Ваша почта" type="email" />

					</InputGroup>
					<InputGroup>
						<InputLeftElement>
							<LockIcon />
						</InputLeftElement>
						<Input onChange={(e) => setPass(e.target.value)} placeholder="Пароль" type="password" />
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