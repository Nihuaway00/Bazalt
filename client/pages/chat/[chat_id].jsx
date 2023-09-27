import {
	AddIcon,
	ArrowBackIcon,
	ArrowForwardIcon,
	AttachmentIcon,
	ChatIcon,
	CloseIcon,
	SettingsIcon
} from '@chakra-ui/icons'
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
	Container,
	GridItem,
	Center,
	FormLabel,
	Icon,
	WrapItem
} from '@chakra-ui/react'
import {useRouter} from 'next/router'
import {useContext, useEffect, useState} from 'react'
import MessageItem from '../../components/messages/item/message_item'
import {UserContext} from '../../layouts/providers'
import SelfMessageItem from '../../components/messages/item/self_message_item'
import ImageNext from 'next/image'


const importChat = {
	avatarID: '',
	creatorID: 'creatorID',
	isPrivate: false,
	key: {},
	title: 'Хуй сунь вынь',
	_id: 'chatID'
}

const importAvatar = {
	path: '/2.jpg'
}

const importMessages = [
	{
		_id: 'fdfjs',
		value: 'В чате будет 3 статуса пользователей: Создатель, Администратор и обычный',
		userID: 'userID',
		sentAt: new Date().valueOf(),
		chatID: 'chatID',
		editAt: null,
		hasAttachments: false,
		isReplyTo: null,
		system: false
	},
]

const ChatPage = () => {
	const router = useRouter()
	const {chat_id} = router.query
	const {userID} = useContext(UserContext)

	const [chat, setChat] = useState(null)
	const [avatar, setAvatar] = useState(null)
	const [messages, setMessages] = useState([])
	const [files, setFiles] = useState([])


	useEffect(() => {
		if (!chat_id) return
		setChat(importChat)
	}, [chat_id])

	useEffect(() => {
		if (!chat) return
		setAvatar(importAvatar)
		setMessages(importMessages)
	}, [chat])

	if (!chat || !avatar) {
		return (
			<Heading>Загрузка...</Heading>
		)
	}

	return (
		<Flex flexDirection={'column'} height={'100%'}>
			<Stack spacing={4}>
				<Button onClick={() => router.push('/')} size={'sm'} leftIcon={<ArrowBackIcon/>} variant={'link'}>
					<Text>Список чатов</Text>
				</Button>
				<Stack padding={'0 0 24px 0'} direction={'row'} align={'center'} justify={'space-between'} spacing={6}
					   borderBottom={'1px rgba(0,0,0,0.1) solid'}>
					<Avatar src={avatar.path} size={'sm'}/>
					<Heading size={'md'}>{chat.title}</Heading>
					<SettingsIcon/>
				</Stack>
			</Stack>
			<Stack padding={'24px 0 24px 0'} spacing={0} overflow={'auto'} height={'100%'} direction={'column-reverse'}>
				{
					messages.map((message, index) => {
						return (
							index === 2 ? <SelfMessageItem key={index} message={message}/> :
								<MessageItem key={index} message={message}/>
						)
					})
				}
			</Stack>
			<Grid gap={4} maxWidth={'100%'} templateColumns={'min-content auto min-content'} templateRows={'auto auto'}
				  templateAreas={
					  `"empty2 attach attach"
			 "left input right"
			 `} padding={'12px 0 0 0'} spacing={4} borderTop={'1px rgba(0,0,0,0.1) solid'}>
				<GridItem area="left">
					<Stack spacing={4} padding={'8px 0 0 0'}>
						{/* <ChatIcon /> */}
						<FormLabel padding={0} margin={0} position={'relative'}>
							<Input onChange={(e) => {
								var img = new Image()
								img.src = window.URL.createObjectURL(e.target.files[0])
								img.onload = ({srcElement}) => {
									setFiles(prev => [...prev, {
										src: srcElement.src,
										width: srcElement.naturalWidth,
										height: srcElement.naturalHeight
									}])
								}
							}} position={'absolute'} opacity={0} type="file" variant={'outline'} cursor={'pointer'}/>
							<AttachmentIcon cursor={'pointer'}/>
						</FormLabel>

					</Stack>
				</GridItem>
				<GridItem area={'input'}>
					<Textarea bg={'gray.100'} padding={'8px 12px'} placeholder="Введите сообщение..."
							  variant={'unstyled'} resize={'none'} rows={2}/>
				</GridItem>
				<GridItem area={'attach'}>
					<Wrap margin={'0 0 0 0 '} direction={'row'} width={'100%'}>
						{
							files.map(({src, width, height}, index) => {

								const k = width / height
								return (
									<WrapItem key={index}>
										<Center borderRadius={6} overflow={'hidden'} position={'relative'}
											width={`${40 * k}px`} height={'40px'}>
											<ImageNext src={src} fill={true} alt="" objectFit="contain"/>
											<Center position={'absolute'} top={0} bottom={0} right={0} left={0}
												bg={'rgba(0,0,0,0.2)'}>
												<CloseIcon cursor={'pointer'} onClick={() => {
													setFiles(prev => {
														const arr = [].concat(prev)
														arr.splice(index, 1)
														return arr
													})
												}} color={'white'}/>
											</Center>
										</Center>
									</WrapItem>

								)
							})
						}
						{
							files.length == 0 || (
								<FormLabel position={'relative'} height={'40px'} width={'40px'}
										   border={'1px rgba(0,0,0,0.1) solid'} borderRadius={6}>
									<Input onChange={(e) => {
										var img = new Image()
										img.src = window.URL.createObjectURL(e.target.files[0])
										img.onload = ({srcElement}) => {
											setFiles(prev => [...prev, {
												src: srcElement.src,
												width: srcElement.naturalWidth,
												height: srcElement.naturalHeight
											}])
										}
									}} position={'absolute'} opacity={0} type="file" variant={'outline'}
										   cursor={'pointer'}/>
									<Center width={'100%'} height={'100%'}>
										<AddIcon color={'gray.400'}/>
									</Center>
								</FormLabel>
							)
						}

					</Wrap>
				</GridItem>
				<GridItem area="right">
					<Stack align={'center'}>
						<Button rightIcon={<ArrowForwardIcon/>}>...</Button>

					</Stack>
				</GridItem>
			</Grid>

		</Flex>
	)
}

export default ChatPage