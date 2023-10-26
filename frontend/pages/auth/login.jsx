"use client"
import { Heading, Input, Stack, Text, InputGroup, InputLeftElement, StackDivider, InputRightElement, Button, ModalContent, Wrap, Divider } from "@chakra-ui/react"
import { Modal, ModalBody, ModalHeader, ModalFooter, ModalCloseButton, ModalOverlay } from "@chakra-ui/react"
import { CheckIcon, CloseIcon, EmailIcon, LockIcon, StarIcon, WarningIcon } from "@chakra-ui/icons"
import { useContext, useEffect, useState } from "react"
import { useRouter } from "next/router"
import AuthRoute from "../../routes/authRoute"
import { useDispatch, useSelector } from "react-redux"
import { set, setUser, unauthorized } from "../../store/slices/userSlice"
import { validate } from "validate.js"
import ModalSample from "../../components/common/modal/modalSample"
import { useQuery } from "react-query"
import { useLogin } from "../../hooks/auth/useLogin"
import { useLogout } from "../../hooks/auth/useLogout"
import { useRestore } from "../../hooks/auth/useRestore"


const RequestRestoreModal = ({ isOpen, onClose }) => {
	const onRestore = useRestore()
	const [email, setEmail] = useState("")
	const [isInvalidEmail, setInvalidEmail] = useState(undefined)

	useEffect(() => {
		setInvalidEmail(validate({ value: email }, { value: { email: true } }))
	}, [email])

	const onSendRestore = async () => {
		onRestore.mutate({ email }, {
			onSuccess: () => {
				alert('Check your email')
			},
			onError: (err) => {
				alert('restore: ' + err.message)
			}
		})
	}

	return (
		<ModalSample isOpen={isOpen} onClose={onClose} header={'Восстановление пароля'}>
			<ModalBody paddingTop="24px">
				<InputGroup>
					<InputLeftElement>
						<EmailIcon />
					</InputLeftElement>
					<Input value={email} isInvalid={!email ? false : !!isInvalidEmail} onChange={(e) => setEmail(e.target.value)} isRequired={true} placeholder="Почта вашего аккаунта" type="email" />
					{!email || <InputRightElement>
						{isInvalidEmail ? <WarningIcon /> : <CheckIcon />}
					</InputRightElement>}
				</InputGroup>
			</ModalBody>
			<ModalFooter justifyContent={"center"}>
				<Button onClick={onSendRestore} isDisabled={!email || !!isInvalidEmail}>Отправить</Button>
			</ModalFooter>
		</ModalSample>
	)
}

const LoginPage = () => {
	const router = useRouter();
	const dispatch = useDispatch()
	const [email, setEmail] = useState("")
	const [pass, setPass] = useState("")
	const user = useSelector(state => state.user)

	const [isOpenRestore, setOpenRestore] = useState(false)

	const onLogin = useLogin()
	const onLogout = useLogout()


	const loginHandler = async () => {
		onLogin.mutate({ email, pass }, {
			onSuccess: ({ data }) => {

				dispatch(setUser(data.user))
				localStorage.setItem('sessionID', data.sessionID)
				localStorage.setItem('isAuth', true)
				router.push('/')
			},
			onError: (err) => {
				alert(err.message)
				localStorage.setItem('isAuth', false)
			}
		})
	}

	const logoutHandler = async () => {
		onLogout.mutate({}, {
			onSuccess: () => {
				alert('Logout')
				dispatch(unauthorized())
				localStorage.removeItem('sessionID')
				router.push('/auth/login')
			},
			onError: (err) => {
				alert(err.message)
			}
		})
	}

	if (!user) {
		return (
			<Stack direction={'column'} align={'center'}>
				<Heading>Загрузка ...</Heading>
			</Stack>
		)
	}

	if (!user.unauthorized) {
		return (
			<Stack direction={'column'} align={'center'}>
				<Heading>{user.name},</Heading>
				<Text>вы авторизованы!</Text>
				<Button onClick={logoutHandler}>Выйти</Button>
			</Stack>
		)
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
						setOpenRestore(true)
					}}>Забыли пароль?</Text>
					<Button isLoading={onLogin.isLoading} onClick={loginHandler}>Войти</Button>
				</Stack>
			</Stack>
			<RequestRestoreModal isOpen={isOpenRestore} onClose={() => setOpenRestore(false)} />
		</>
	)
}

export default LoginPage