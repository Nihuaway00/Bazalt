import {
	AddIcon,
	EditIcon,
	SpinnerIcon
} from '@chakra-ui/icons'
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalBody,
} from '@chakra-ui/react'
import {
	Avatar,
	Button,
	Input,
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
import { useContext, useEffect, useState } from 'react'
import InviteModal from './inviteModal'
import FileInput from '../../common/file/fileInput'
import ModalSample from '../../common/modal/modalSample'
import MemberView from './memberView'
import LoadingModal from '../../common/modal/loading'


const importChat = {
	avatarID: '',
	creatorID: 'creatorID',
	isPrivate: false,
	key: {},
	title: 'Хуй сунь вынь',
	_id: 'chatID'
}

const ChatModal = ({ isOpen, onClose, chatID }) => {
	const [isEditable, setEditable] = useState(false)
	const [isChanged, setChanged] = useState(false)
	const [file, setFile] = useState(null)
	const [members, setMembers] = useState([])

	const [chat, setChat] = useState(null)
	const [avatarSrc, setAvatarSrc] = useState(null)

	const [isSaving, setSaving] = useState(false)


	const [isInviteOpen, setInviteOpen] = useState(false)

	useEffect(() => {
		if (!chatID) return
		setTimeout(() => {
			setChat(importChat)


		}, 400)
	}, [chatID])

	useEffect(() => {
		if (!chat) return

		setTimeout(() => {
			setAvatarSrc('http://127.0.0.1:9000/attachments/3.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=8TTWI7FLX9SWXITG7PVX%2F20231003%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20231003T052620Z&X-Amz-Expires=604800&X-Amz-Security-Token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiI4VFRXSTdGTFg5U1dYSVRHN1BWWCIsImV4cCI6MTY5NjMxNzkwMSwicGFyZW50Ijoicm9vdDEyMzQifQ.PP3R4FFMHGLF452RqWNfoMYybAVBNiaKPXP9ZVUC87rT2LJA6fADARx5v0CsJqUelxISGm8tFym5vpIhec1vlg&X-Amz-SignedHeaders=host&versionId=null&X-Amz-Signature=cc6b20c82ceff7bc1280c19698f0740849e9568b96d0f346b876ee68a818fa31')
			setMembers([
				{
					id: 'fdkfsdl',
					userID: 'Архмиед',
				},
				{
					id: 'gfdg4e',
					userID: 'Иван',
				},
			])
		}, 200)
	}, [chat])

	useEffect(() => {
		if (!isOpen) {
			setEditable(false)
		}
	}, [isOpen])

	const onEdit = () => {
		setEditable(true)
	}

	const onSave = () => {

		setSaving(true)

		setTimeout(() => {
			setSaving(false)
			setEditable(false)
		}, 600)
	}

	if (!chat || !members) {
		return (
			<LoadingModal />
		)
	}

	return (
		<>
			<ModalSample isOpen={isOpen} onClose={onClose} header={'Настройки чата'}>
				<ModalBody padding='24px'>
					<Stack spacing='6'>
						<Stack align='center' spacing={2} direction='row'>
							<FormLabel overflow='hidden' position='relative'>
								<Avatar size='xl' src={file ? file.preview.src : avatarSrc} />
								{
									!isEditable || (
										<>
											<FileInput onAttach={(file) => setFile(file)} maxSize={1024 * 1024 * 10} onError={(e) => alert(e)} />
											<Center cursor='pointer' borderRadius='100%' position='absolute' top={0} left='0' bottom='0' right='0' bg='rgba(0,0,0,0.4)'>
												<EditIcon color='white' />
											</Center>
										</>
									)
								}
							</FormLabel>
							<Stack spacing='2'>
								<Text userSelect='none' color='gray.500' fontSize='sm'>Название</Text>
								<Input isDisabled={!isEditable} placeholder={chat.title} />
								{
									isEditable ? (
										<Button size='xs' width='min-content' isLoading={isSaving} colorScheme='blue' mr={3} onClick={onSave}>
											Сохранить
										</Button>
									) : (
										<Button size='xs' width='min-content' colorScheme='blue' variant='ghost' mr={3} onClick={onEdit}>
											Изменить
										</Button>
									)
								}
							</Stack>
						</Stack>
						<Divider />
						<Stack spacing='3'>
							<Button onClick={() => setInviteOpen(true)} size='sm'>
								<Stack spacing='2' direction='row' align='center'>
									<AddIcon boxSize='12px' />
									<Text fontSize='sm'>Пригласить</Text>
								</Stack>
							</Button>
							{
								members.map(member => {
									return (
										<MemberView memberID={member.id} userID={member.userID} />
									)
								})
							}
						</Stack>
					</Stack>
				</ModalBody>
				<Divider />
			</ModalSample>
			{
				!isInviteOpen || <InviteModal isInviteOpen={isInviteOpen} onClose={() => setInviteOpen(false)} />
			}

		</>

	)
}

export default ChatModal