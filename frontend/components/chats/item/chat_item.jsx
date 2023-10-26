import { ChatIcon, CloseIcon, DeleteIcon, HamburgerIcon, SmallCloseIcon } from '@chakra-ui/icons'
import {
	Avatar, AvatarBadge, AvatarGroup, GenericAvatarIcon, Heading, Menu, MenuButton, MenuItem, MenuList, Stack, Text
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useGetChat } from '../../../hooks/chats/useGetChat'
import { useRemoveChat } from '../../../hooks/chats/useRemoveChat'
import { useQueryClient } from 'react-query'
import { useLeaveChat } from '../../../hooks/chats/useLeaveChat'
import { useEffect, useState } from 'react'

const ChatItem = ({ chatID }) => {
	const queryClient = useQueryClient()
	const router = useRouter()
	const onGetChat = useGetChat(chatID)
	const onLeaveChat = useLeaveChat(chatID)

	const [chat, setChat] = useState(null)
	const [lastMessage, setLastMessage] = useState(null)
	const [unreadCount, setUnreadCount] = useState(null)

	useEffect(() => {
		if (!onGetChat.isSuccess) return

		setChat(onGetChat.data.chat)
		setLastMessage(onGetChat.data.lastMessage)
		setUnreadCount(onGetChat.data.unreadCount)
	}, [onGetChat.status])

	if (!chat) {
		return (
			<Stack width={'100%'} direction={'row'} spacing={4} align={'stretch'}>
				<Text>Загрузка...</Text>
			</Stack>
		)
	}

	const leaveHandler = () => {
		onLeaveChat.mutate({}, {
			onSuccess: () => {
				queryClient.invalidateQueries('chats')
			},
			onError: (err) => {
				alert(err.message)
			}
		})
	}

	const removeHandler = () => {

	}

	return (
		<Stack width={'100%'} direction={'row'} spacing={4} align={'stretch'}>
			<Stack onClick={() => router.push('/chat/' + chatID)} height={'100%'} justify={'center'}
				cursor={'pointer'}>
				<Avatar size={'md'} src={'/fdf.jpg'}>
					{
						unreadCount ? (
							<AvatarBadge bg="red" borderColor="papayawhip" boxSize={'1.25em'}>
								<Text fontSize={'xs'}>{unreadCount}</Text>
							</AvatarBadge>
						) : null
					}
				</Avatar>
			</Stack>
			<Stack width={'100%'} onClick={() => router.push('/chat/' + chatID)} spacing={2} cursor={'pointer'}>
				<Heading size={'sm'}>{onGetChat.data.chat.title}</Heading>
				<Stack direction={'row'}>
					{
						lastMessage && (lastMessage.message || lastMessage.attachments) ? <Text fontSize={'sm'} noOfLines={2}>{lastMessage.message.value}</Text> :
							<Text fontSize={'sm'} opacity={'0.5'} noOfLines={1}>Пусто</Text>
					}
				</Stack>
			</Stack>
			<Stack justify={'space-between'} align={'end'}>
				<Menu>
					{({ isOpen }) => (<>
						<MenuButton isOpen={isOpen}>

							{isOpen ? <SmallCloseIcon /> : <HamburgerIcon />}
						</MenuButton>
						<MenuList>
							<MenuItem icon={<DeleteIcon />}>Удалить историю</MenuItem>
							<MenuItem onClick={leaveHandler}
								icon={<DeleteIcon />}>{'Покинуть чат'}</MenuItem>
						</MenuList>
					</>

					)}

				</Menu>
				{
					!lastMessage?.message?.sentAt || <Text userSelect={'none'} fontSize={'xs'} whiteSpace={'nowrap'}>
						{
							new Date(lastMessage.message.sentAt.seconds * 1000).toLocaleString('ru', {
								day: 'numeric',
								month: 'short',
								hour: 'numeric',
								minute: 'numeric'
							})
						}
					</Text>
				}
			</Stack>
		</Stack>
	)
}

export default ChatItem