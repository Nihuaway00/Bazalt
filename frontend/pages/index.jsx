import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import {
	Avatar,
	Box,
	Button,
	Container,
	Divider, Grid, GridItem,
	Heading,
	Input,
	InputGroup,
	InputLeftElement,
	Stack,
	TagLeftIcon,
	TagRightIcon,
	Text, Textarea
} from '@chakra-ui/react'
import {
	Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
} from '@chakra-ui/react'
import ChatItem from '../components/chats/item/chat_item'
import ChatNull from '../components/chats/null/chat_null'
import { useRouter } from 'next/router'
import UserModal from '../components/user/modal'
import { useDispatch, useSelector } from 'react-redux'
import { useGetChats } from '../hooks/user/useGetChats'
import { io } from 'socket.io-client'
import { socketConnect } from '../store/slices/socketSlice'

const Home = () => {
	const router = useRouter()
	const dispatch = useDispatch()
	const user = useSelector(state => state.user)
	const [isUserModalOpen, setUserModalOpen] = useState(false)

	const onGetChats = useGetChats(user.unauthorized)

	if (onGetChats.isError) {
		return (<Heading>Error: ${onGetChats.error.message}</Heading>)
	}


	if (onGetChats.isLoading) {
		return (<Heading>Загрузка...</Heading>)
	}

	if (!onGetChats.data) {
		return (<Heading>Ошибка при загрузке данных</Heading>)
	}


	return (
		<>
			<Stack spacing={6} align={'center'} height='100%'>
				<Stack direction='horizontal' align='center' justifyContent='space-between' width='100%'>
					<Heading size="lg" userSelect={'none'}>Чаты</Heading>
					<Stack onClick={() => setUserModalOpen(true)} cursor='pointer' direction='horizontal' align='center'>
						<Text>{user.name}</Text>
						<Avatar src='./2.jpg' size='xs' />
					</Stack>
				</Stack>
				<Divider />
				<Stack width='100%' direction={'row'} height='100%' spacing={8}>
					<Container height='100%' overflow='auto'>
						<Stack padding='0 0 48px 0' spacing={4} minWidth={'300px'} width='100%' align={'center'}>
							{onGetChats.data.chatIDs.length > 0 ? onGetChats.data.chatIDs.map(chatID => {
								return <ChatItem key={chatID} chatID={chatID} />
							}) : <ChatNull />}
						</Stack>
					</Container>
					<Stack>
						<Button onClick={() => router.push('/message')} variant={'outline'} size={'sm'}>Написать</Button>
						<Button onClick={() => router.push('/new_chat')} variant={'outline'} size={'sm'}>Создать чат</Button>
					</Stack>
				</Stack>
			</Stack>
			{
				!isUserModalOpen || <UserModal userID={'fdfkjl'} isOpen={isUserModalOpen} onClose={() => setUserModalOpen(false)} />
			}
		</>

	)
}

export default Home