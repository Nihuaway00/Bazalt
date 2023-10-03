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
import ModalSample from '../../../common/modal/modalSample'


const InviteModal = ({ isInviteOpen, onClose }) => {
	const router = useRouter()
	const [searchValue, setSearchValue] = useState('')
	const [isSearchLoading, setSearchLoading] = useState(false)
	const [isInvalid, setInvalid] = useState(false)

	useEffect(() => {
		const re = new RegExp(/[^\w\s]/, 'gi')
		setInvalid(!!searchValue.match(re))
	}, [searchValue])

	return (
		<ModalSample isOpen={isInviteOpen} onClose={onClose} header={'Пригласить'}>
			<ModalBody padding='24px'>
				<Stack direction='row' spacing={2}>
					<Stack width='100%'>
						<InputGroup>
							<InputLeftElement>
								<SearchIcon />
							</InputLeftElement>
							<Input isInvalid={isInvalid} onChange={(e) => setSearchValue(e.target.value)} isRequired={true}
								placeholder="Тег пользователя без собаки"
								type="email" />
						</InputGroup>
						{!isInvalid || <Text marginLeft='8px' color='red'>Только латинские буквы и цифры</Text>}

					</Stack>
					<Button isDisabled={!searchValue || isInvalid} isLoading={isSearchLoading} colorScheme="blue" variant={'outline'}
						onClick={() => {
							//request
							setSearchLoading(true)
							setTimeout(() => {

								if (searchValue === 'undefined') {
									alert('Пользователь не найден')
									setSearchLoading(false)
									return
								}

								setSearchLoading(false)
							}, 200)
						}}>
						Пригласить
					</Button>
				</Stack>

			</ModalBody>
		</ModalSample>
	)
}

export default InviteModal