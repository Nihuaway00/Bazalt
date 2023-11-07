import {
	AddIcon,
	ArrowBackIcon,
	ArrowForwardIcon,
	ArrowRightIcon,
	AttachmentIcon,
	ChatIcon,
	CloseIcon,
	EditIcon,
	SearchIcon,
	SettingsIcon,
	SpinnerIcon
} from '@chakra-ui/icons'
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
} from '@chakra-ui/react'
import {
	Avatar,
	Wrap,
	Button,
	Heading,
	Input,
	InputGroup,
	InputRightElement,
	Stack,
	Text,
	Textarea,
	ButtonGroup,
	Grid,
	Flex,
	Divider,
	IconButton,
	Box,
	InputLeftElement,
	Container,
	GridItem,
	Center,
	FormLabel,
	Icon,
	WrapItem
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import MessageItem from '../../components/messages/item/message_item'
import { UserContext } from '../../layouts/providers'
import ImageNext from 'next/image'
import FileList from '../../components/common/file/fileList'
import FileInput from '../../components/common/file/fileInput'
import FileInputButton from '../../components/common/file/fileInputButton'
import ChatModal from '../../components/chats/chatModal'
import { useDispatch, useSelector } from 'react-redux'
import { useGetChat } from '../../hooks/chats/useGetChat'
import { useGetMessages } from '../../hooks/chats/useGetMessagesChat'
import { useSendMessage } from '../../hooks/messages/useSendMessage'
import { useQueryClient } from 'react-query'
import { addMessageAction, setMessageAction } from '../../store/slices/messageSlice'

const Top = ({ chat, avatar, onOpenSettings }) => {
	const router = useRouter()

	return (
		<Stack spacing={4}>
			<Button onClick={() => router.push('/')} size={'sm'} leftIcon={<ArrowBackIcon />} variant={'link'}>
				<Text>Список чатов</Text>
			</Button>
			<Stack padding={'0 0 24px 0'} direction={'row'} align={'center'} justify={'space-between'} spacing={6}
				borderBottom={'1px rgba(0,0,0,0.1) solid'}>
				<Avatar src={avatar ? avatar.path : '2.jpg'} size={'sm'} />
				<Heading size={'md'}>{chat.title}</Heading>
				<SettingsIcon cursor='pointer' onClick={onOpenSettings} />
			</Stack>
		</Stack>
	)
}


const Middle = ({ messages }) => {
	const user = useSelector(state => state.user)

	if (!messages) {
		return <Stack padding={'24px 0 24px 0'} spacing={2} overflow={'auto'} height={'100%'} direction={'column-reverse'}>
			<Text>Пусто</Text>
		</Stack>
	}

	return (
		<Stack padding={'24px 0 24px 0'} spacing={2} overflow={'auto'} height={'100%'} direction={'column-reverse'}>
			{
				messages.map(({ message, attachments }, index) => {
					console.log(index, message);
					return (
						<MessageItem attachments={attachments} key={index} userID={message.userID} value={message.value} id={message.id} hasAttachments={message.hasAttachments} editAt={message.editAt} isReplyTo={message.isReplyTo} sentAt={message.sentAt} isSelf={message.userID === user._id} />
					)
				})
			}
		</Stack>
	)
}

const Bottom = ({ chatID }) => {
	const queryClient = useQueryClient()
	// const socket = useSelector(state => state.socket)
	const [files, setFiles] = useState([])
	const [value, setValue] = useState('')
	const onSendMessage = useSendMessage(chatID)

	const sendHandler = () => {
		onSendMessage.mutate({ value, attachments: files }, {
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['chat', chatID, 'messages'] })
			},
			onError: (err) => alert(err.message)
		})
		setFiles([])
		setValue([])
	}

	return (
		<Grid gap={2} maxWidth={'100%'} templateColumns={'min-content auto min-content'} templateRows={'auto auto'}
			templateAreas={
				`"empty2 attach attach"
	 			"left input right"
	 `} padding={'12px 24px'} borderBottomRadius={8} spacing={4} border={'1px rgba(0,0,0,0.1) solid'} bg={'rgba(0,0,0,0.02)'}>
			<GridItem area="left" padding={0} marginRight={2}>
				<Center height={'100%'}>
					<FormLabel padding={0} margin={0} position={'relative'} height={'100%'}>
						<FileInput maxSize='209715200' onError={(err) => alert(err)} onAttach={(newFile) => setFiles(prev => [...prev, newFile])} />
						<Stack height={'100%'} justify={'center'}>

							<AttachmentIcon cursor={'pointer'} color={'gray.500'} />
						</Stack>

					</FormLabel>
				</Center>
			</GridItem>
			<GridItem border={'1px rgba(0,0,0,0.1) solid'} borderRadius={4} area={'input'}>
				<Textarea value={value} onChange={(e) => setValue(e.target.value)} bg={'white'} padding={'8px 12px'} placeholder="Введите сообщение..."
					variant={'unstyled'} resize={'none'} rows={1} height={'42px'} />
			</GridItem>
			<GridItem area={'attach'}>
				<FileList files={files} onRemove={(index) => setFiles(prev => {
					const arr = [].concat(prev)
					arr.splice(index, 1)
					return arr
				})}
				>
					{(files.length >= 10 || files.length === 0) || <FileInputButton onError={(err) => alert(err)} onAttach={(newFile) => setFiles(prev => [...prev, newFile])} />}
				</FileList>
			</GridItem>
			<GridItem area="right" marginLeft={4}>
				<Stack onClick={sendHandler} height={'100%'} cursor={'pointer'} align={'end'} justify={'center'} width={'28px'}>
					<IconButton isDisabled={!value && files.length === 0} icon={<ArrowRightIcon boxSize={3} color={'gray.500'} />} variant={'outline'} isLoading={onSendMessage.isLoading} />
				</Stack>
			</GridItem>
		</Grid>
	)
}

const ChatPage = () => {
	const user = useSelector(state => state.user)
	const router = useRouter()
	const dispatch = useDispatch()
	const { chat_id } = router.query

	const onGetChat = useGetChat(chat_id)
	const onGetMessages = useGetMessages(chat_id)

	const [chat, setChat] = useState(null)
	const [avatar, setAvatar] = useState(null)
	const messages = useSelector(state => state.messages)
	const [isSettingsOpen, setSettingsOpen] = useState(false)

	useEffect(() => {
		if (!onGetChat.isSuccess) return
		setChat(onGetChat.data.chat)
	}, [onGetChat.status])

	useEffect(() => {
		if (!chat_id) return
		console.log(user);
		onGetMessages.mutate({ chatID: chat_id, timestamp: 1698993956266, newest: false }, {
			onSuccess: ({ data }) => {
				console.log(data);
				dispatch(addMessageAction(data.messages))
			},
			onError: (err) => {
				alert(err.message)
			}
		})
	}, [chat_id])

	if (!chat) {
		return (
			<Heading>Загрузка...</Heading>
		)
	}

	return (
		<Flex flexDirection={'column'} height={'100%'}>
			<Top onOpenSettings={() => setSettingsOpen(true)} chat={chat} avatar={avatar} />
			<Middle messages={messages} />
			<Bottom chatID={chat_id} />
			{
				!isSettingsOpen || <ChatModal chatID={'gdfkjgd'} isOpen={isSettingsOpen} onClose={() => setSettingsOpen(false)} />
			}

		</Flex>
	)
}

export default ChatPage