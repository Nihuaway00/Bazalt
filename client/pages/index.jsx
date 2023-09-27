import Head from 'next/head'
import {useContext, useEffect, useState} from 'react'
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
import {UserContext} from '../layouts/providers'
import ChatNull from '../components/chats/null/chat_null'
import {ChatIcon, EmailIcon, SearchIcon} from '@chakra-ui/icons'
import {useRouter} from 'next/router'

const Home = () => {
	const router = useRouter()
	const user = useContext(UserContext)
	const [chatIDs, setChatIDs] = useState(null)
	const [lastMessage, setLastMessage] = useState(null)

	const [isOpen, setOpen] = useState(false)
	const [searchValue, setSearchValue] = useState('')
	const [isSearchLoading, setSearchLoading] = useState(false)

	const [receiverID, setReceiverID] = useState(null)
	const [messageValue, setMessageValue] = useState('')

	useEffect(() => {
		if (!user) return
		//request chatIDs
		setChatIDs(['chatID1', 'chatID2'])
	}, [user])


	if (!chatIDs) {
		return (<Heading>Загрузка...</Heading>)
	}

	return (
		<Stack spacing={6} align={'center'}>
			<Heading size="lg" userSelect={'none'}>Чаты</Heading>
			<Stack direction={'row'} spacing={16}>
				<Stack spacing={4} minWidth={'300px'} maxWidth={'600px'} align={'center'}>
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

						return <ChatItem key={chat._id} chat={chat} lastMessage={lastMessage}/>
					}) : <ChatNull/>}
				</Stack>
				<Stack>
					<Button onClick={() => router.push('/message')} variant={'outline'} size={'sm'}>Написать</Button>
					<Button variant={'outline'} size={'sm'}>Создать чат</Button>
				</Stack>
			</Stack>
		</Stack>
	)
}

export default Home