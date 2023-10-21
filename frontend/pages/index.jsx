import { useEffect, useState } from 'react'
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
import { ChatIcon, EmailIcon, SearchIcon } from '@chakra-ui/icons'
import { useRouter } from 'next/router'
import UserModal from '../components/user/modal'
import { useSelector } from 'react-redux'
import UserRoute from '../routes/userRoute'
import Authorized from '../middlewares/authorizedMiddleware'

const Home = () => {
	const router = useRouter()
	const user = useSelector(state => state.user)
	const [chatIDs, setChatIDs] = useState(null)
	const [lastMessage, setLastMessage] = useState(null)

	const [isOpen, setOpen] = useState(false)
	const [searchValue, setSearchValue] = useState('')
	const [isSearchLoading, setSearchLoading] = useState(false)

	const [receiverID, setReceiverID] = useState(null)
	const [messageValue, setMessageValue] = useState('')

	const [isUserModalOpen, setUserModalOpen] = useState(false)

	useEffect(() => {
		if (!user) return
		const getChats = async () => await UserRoute.getChats()
		getChats().then(({ chatIDs }) => {
			setChatIDs(chatIDs)
		})
	}, [user])


	if (chatIDs === null) {
		return (<Heading>Загрузка...</Heading>)
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
							{chatIDs.length > 0 ? chatIDs.map(chatID => {
								//request
								const chat = {
									_id: chatID,
									title: 'Хуйс' + chatID,
									creatorID: 'creatorID',
									isPrivate: false,
									key: {},
									avatarID: 'avatarID',
									unreadCount: 3
								}

								const lastMessage = {
									_id: 'mesd',
									value: 'зуй зуй хуй хуй...! ',
									sentAt: new Date().getTime(),
									chatID: 'chatID',
									editAt: null,
									isReplyTo: null,
									hasAttachments: false,
									system: false,
									userID: 'userID'
								}

								return <ChatItem key={chat._id} chat={chat} lastMessage={lastMessage} />
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