import {ChatIcon, CloseIcon, DeleteIcon, HamburgerIcon, SmallCloseIcon} from '@chakra-ui/icons'
import {
	Avatar, AvatarBadge, AvatarGroup, GenericAvatarIcon, Heading, Menu, MenuButton, MenuItem, MenuList, Stack, Text
} from '@chakra-ui/react'
import {useRouter} from 'next/router'
import {useState} from 'react'


const ChatItem = ({chat, lastMessage}) => {
	const router = useRouter()

	return (<Stack width={'100%'} direction={'row'} spacing={4} align={'stretch'}>
		<Stack onClick={() => router.push('/chat/' + chat._id)} height={'100%'} justify={'center'}
			   cursor={'pointer'}>
			<Avatar size={'md'} src={'/fdf.jpg'}>
				{chat.unreadCount > 0 ? (<AvatarBadge bg="red" borderColor="papayawhip" boxSize={'1.25em'}>
					<Text fontSize={'xs'}>{chat.unreadCount}</Text>
				</AvatarBadge>) : null}
			</Avatar>
		</Stack>
		<Stack width={'100%'} onClick={() => router.push('/chat/' + chat._id)} spacing={2} cursor={'pointer'}>
			<Heading size={'sm'}>{chat.title}</Heading>
			<Stack direction={'row'}>
				{lastMessage ? <Text fontSize={'sm'} noOfLines={2}>{lastMessage.value}</Text> :
					<Text fontSize={'sm'} opacity={'0.5'} noOfLines={1}>[ Пусто ]</Text>}
			</Stack>
		</Stack>
		<Stack justify={'space-between'} align={'end'}>
			<Menu>
				{({isOpen}) => (<>
					<MenuButton isOpen={isOpen}>

						{isOpen ? <SmallCloseIcon/> : <HamburgerIcon/>}
					</MenuButton>
					<MenuList>
						<MenuItem icon={<DeleteIcon/>}>Удалить историю</MenuItem>
						<MenuItem
							icon={<DeleteIcon/>}>{chat.isPrivate ? 'Удалить чат' : 'Покинуть чат'}</MenuItem>
					</MenuList>
				</>

				)}

			</Menu>
			<Text userSelect={'none'} fontSize={'xs'}
				  whiteSpace={'nowrap'}>{new Date(lastMessage.sentAt).toLocaleString('ru', {
					day: 'numeric',
					month: 'short',
					hour: 'numeric',
					minute: 'numeric'
				})}</Text>
		</Stack>
	</Stack>)
}

export default ChatItem