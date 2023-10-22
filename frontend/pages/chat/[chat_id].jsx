import {
	AddIcon,
	ArrowBackIcon,
	ArrowForwardIcon,
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
import ModalSample from '../../components/common/modal/modalSample'
import ChatModal from '../../components/chats/chatModal'
import { useSelector } from 'react-redux'
import { useGetChat } from '../../hooks/chats/useGetChat'
import { useGetMessages } from '../../hooks/chats/useGetMessagesChat'
import { useSendMessage } from '../../hooks/messages/useSendMessage'
import { useQueryClient } from 'react-query'


// const importChat = {
// 	avatarID: '',
// 	creatorID: 'creatorID',
// 	isPrivate: false,
// 	key: {},
// 	title: 'Хуй сунь вынь',
// 	_id: 'chatID'
// }

// const importAvatar = {
// 	path: '/2.jpg'
// }

// const importMessages = [
// 	{
// 		"userID": "123",
// 		"value": "Привет! Как твои дела ?",
// 		"id": "1",
// 		"editAt": "",
// 		"sentAt": "192819372",
// 		attachmets: [
// 			{
// 				preview: 'image',
// 				filename: '3',
// 				src: 'http://127.0.0.1:9000/attachments/3.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=8TTWI7FLX9SWXITG7PVX%2F20231002%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20231002T192614Z&X-Amz-Expires=604800&X-Amz-Security-Token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiI4VFRXSTdGTFg5U1dYSVRHN1BWWCIsImV4cCI6MTY5NjMxNzkwMSwicGFyZW50Ijoicm9vdDEyMzQifQ.PP3R4FFMHGLF452RqWNfoMYybAVBNiaKPXP9ZVUC87rT2LJA6fADARx5v0CsJqUelxISGm8tFym5vpIhec1vlg&X-Amz-SignedHeaders=host&versionId=null&X-Amz-Signature=4037df417e30b42ae19d928db072894178472fa014a19328f0ab50dd15a64207'
// 			},
// 			{
// 				filename: 'compose.yaml',
// 				src: "http://127.0.0.1:9000/attachments/compose.yml?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=8TTWI7FLX9SWXITG7PVX%2F20231002%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20231002T214347Z&X-Amz-Expires=604800&X-Amz-Security-Token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiI4VFRXSTdGTFg5U1dYSVRHN1BWWCIsImV4cCI6MTY5NjMxNzkwMSwicGFyZW50Ijoicm9vdDEyMzQifQ.PP3R4FFMHGLF452RqWNfoMYybAVBNiaKPXP9ZVUC87rT2LJA6fADARx5v0CsJqUelxISGm8tFym5vpIhec1vlg&X-Amz-SignedHeaders=host&versionId=null&X-Amz-Signature=ee2e888167830ca2809f63a6ec1b691af168b3906ce066e8616d606fa4da865d"
// 			}
// 		]
// 	},
// 	{
// 		"userID": "456",
// 		"value": "Нормально, спасибо! А у тебя как дела ?",
// 		"id": "2",
// 		"editAt": "",
// 		"sentAt": "",
// 		attachmets: [{
// 			filename: 'videoplayback',
// 			src: "http://127.0.0.1:9000/attachments/videoplayback.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=8TTWI7FLX9SWXITG7PVX%2F20231002%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20231002T214326Z&X-Amz-Expires=604800&X-Amz-Security-Token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiI4VFRXSTdGTFg5U1dYSVRHN1BWWCIsImV4cCI6MTY5NjMxNzkwMSwicGFyZW50Ijoicm9vdDEyMzQifQ.PP3R4FFMHGLF452RqWNfoMYybAVBNiaKPXP9ZVUC87rT2LJA6fADARx5v0CsJqUelxISGm8tFym5vpIhec1vlg&X-Amz-SignedHeaders=host&versionId=null&X-Amz-Signature=5fac0bd8606168b783c802110869c61d21259d1198ed38f3c72961e9cb10ad88"
// 		}]
// 	},
// 	{
// 		"userID": "789",
// 		"value": "У меня тоже всё хорошо.Чем занимаешься ?",
// 		"id": "3",
// 		"editAt": "",
// 		"sentAt": "",
// 		attachmets: [
// 			{
// 				filename: 'image',
// 				src: 'http://127.0.0.1:9000/attachments/banner.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=8TTWI7FLX9SWXITG7PVX%2F20231002%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20231002T192628Z&X-Amz-Expires=604800&X-Amz-Security-Token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiI4VFRXSTdGTFg5U1dYSVRHN1BWWCIsImV4cCI6MTY5NjMxNzkwMSwicGFyZW50Ijoicm9vdDEyMzQifQ.PP3R4FFMHGLF452RqWNfoMYybAVBNiaKPXP9ZVUC87rT2LJA6fADARx5v0CsJqUelxISGm8tFym5vpIhec1vlg&X-Amz-SignedHeaders=host&versionId=null&X-Amz-Signature=a21a90a79c07b30bd3088aed6b3d9a4bf02cb24693a544040a9b26402cef827e'
// 			}
// 		]
// 	}
// ]

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
	return (
		<Stack padding={'24px 0 24px 0'} spacing={2} overflow={'auto'} height={'100%'} direction={'column-reverse'}>
			{
				messages.map(({ message, attachmets }, index) => {
					return (
						<MessageItem attachmets={attachmets} key={index} userID={message.userID} value={message.value} id={message.id} hasAttachments={message.hasAttachments} editAt={message.editAt} isReplyTo={message.isReplyTo} sentAt={message.sentAt} isSelf={index === 1} />
					)
				})
			}
		</Stack>
	)
}

const Bottom = ({ chatID }) => {
	const queryClient = useQueryClient()

	const [files, setFiles] = useState([])
	const [value, setValue] = useState('')
	const onSendMessage = useSendMessage(chatID)

	const sendHandler = () => {
		onSendMessage.mutate({ value, attachmets: [] }, {
			onSuccess: ({ data }) => {
				queryClient.invalidateQueries({ queryKey: ['chat', chatID, 'messages'] })
			},
			onError: (err) => alert(err.message)
		})
	}

	return (
		<Grid gap={4} maxWidth={'100%'} templateColumns={'min-content auto min-content'} templateRows={'auto auto'}
			templateAreas={
				`"empty2 attach attach"
	 			"left input right"
	 `} padding={'12px 0 0 0'} spacing={4} borderTop={'1px rgba(0,0,0,0.1) solid'}>
			<GridItem area="left">
				<Stack spacing={4} padding={'8px 0 0 0'}>
					<FormLabel padding={0} margin={0} position={'relative'}>
						<FileInput maxSize='209715200' onError={(err) => alert(err)} onAttach={(newFile) => setFiles(prev => [...prev, newFile])} />
						<AttachmentIcon cursor={'pointer'} />
					</FormLabel>
				</Stack>
			</GridItem>
			<GridItem area={'input'}>
				<Textarea value={value} onChange={(e) => setValue(e.target.value)} bg={'gray.100'} padding={'8px 12px'} placeholder="Введите сообщение..."
					variant={'unstyled'} resize={'none'} rows={2} />
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
			<GridItem area="right">
				<Stack align={'center'}>
					<Button onClick={sendHandler} rightIcon={<ArrowForwardIcon />}>...</Button>

				</Stack>
			</GridItem>
		</Grid>
	)
}

const ChatPage = () => {
	const router = useRouter()
	const { chat_id } = router.query
	const user = useSelector(state => state.user)

	const onGetChat = useGetChat(chat_id)
	const onGetMessages = useGetMessages(chat_id)

	const [chat, setChat] = useState(null)
	const [avatar, setAvatar] = useState(null)
	const [messages, setMessages] = useState([])


	const [isSettingsOpen, setSettingsOpen] = useState(false)

	useEffect(() => {
		if (!onGetChat.isSuccess) return
		setChat(onGetChat.data.chat)
	}, [onGetChat.status])

	useEffect(() => {
		if (!chat_id) return

		onGetMessages.mutate({ chatID: chat_id, timestamp: new Date().valueOf(), newest: false }, {
			onSuccess: ({ data }) => {
				setMessages(data.messages)
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