import { Avatar, Center, Text, FormLabel, ModalBody, Stack, Input, Button, Modal, ModalOverlay, ModalContent, InputGroup, InputLeftAddon, Divider } from "@chakra-ui/react"
import ModalSample from "../../common/modal/modalSample"
import FileInput from "../../common/file/fileInput"
import { EditIcon, SpinnerIcon } from "@chakra-ui/icons"
import { useEffect, useState } from "react"
import LoadingModal from "../../common/modal/loading"

const UserModal = ({ isOpen, onClose, userID }) => {
	const [user, setUser] = useState(null)
	const [isEditable, setEditable] = useState(false)
	const [isChanged, setChanged] = useState(false)
	const [file, setFile] = useState(null)
	const [avatarSrc, setAvatarSrc] = useState(null)

	const [newName, setNewName] = useState('')

	const [isSaving, setSaving] = useState(false)


	useEffect(() => {
		if (!userID) return
		//request to user by userID

		setTimeout(() => {
			setUser({
				email: 'nikitaemaeny@gmail.com',
				name: 'Troxya'
			})
		}, 400)

	}, [userID])

	useEffect(() => {
		if (!user) return
		//request to avatar by userID

		setAvatarSrc('/2.jpg')
	}, [user])

	useEffect(() => {
		if (!isEditable) {
			setNewName('')
		}
	}, [isEditable])

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

	if (!user) {
		return (
			<LoadingModal />
		)
	}

	return (
		<ModalSample header={'Профиль'} isOpen={isOpen} onClose={onClose}>
			<ModalBody padding={'24px'}>
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
						<Stack spacing='2'>
							<Text userSelect='none' color='gray.500' fontSize='sm'>Имя</Text>
							<InputGroup size='sm'>
								{/* <InputLeftAddon children={user.name} /> */}
								<Input onChange={(e) => setNewName(e.target.value)} isDisabled={!isEditable} value={newName} placeholder={'Новое имя'} />
							</InputGroup>
						</Stack>

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
			</ModalBody>
		</ModalSample>
	)
}

export default UserModal