import {
	Button, Center,
	Divider, FormLabel,
	Grid,
	GridItem,
	Heading,
	Input,
	InputGroup,
	InputLeftElement,
	Stack,
	Text, Textarea, Wrap, WrapItem
} from '@chakra-ui/react'
import { AddIcon, ArrowBackIcon, CloseIcon, SearchIcon } from '@chakra-ui/icons'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import ImageNext from 'next/image'
import FileInput from '../../../components/common/file/fileInput'
import FileList from '../../../components/common/file/fileList'
import FileInputButton from '../../../components/common/file/fileInputButton'


const MessagePage = () => {
	const router = useRouter()
	const [searchValue, setSearchValue] = useState('')
	const [isSearchLoading, setSearchLoading] = useState(false)

	const [receiverID, setReceiverID] = useState(null)
	const [messageValue, setMessageValue] = useState('')

	const [files, setFiles] = useState([])
	const [isLargeFiles, setLargeFiles] = useState(false)


	return (
		<Stack spacing={6} align={'center'} height={'100%'} paddingTop={'128px'}>
			<Button onClick={() => router.push('/message')} size={'sm'} leftIcon={<ArrowBackIcon />} variant={'link'}>
				<Text>Назад</Text>
			</Button>
			<Heading size="lg" userSelect={'none'}>Можете писать</Heading>
			<Textarea onChange={(e) => setMessageValue(e.target.value)} isRequired={true}
				placeholder="Теперь пишите сообщение..."
				type="email" />
			<FileList files={files} onRemove={(index) => setFiles(prev => {
				const arr = [].concat(prev)
				arr.splice(index, 1)
				return arr
			})}
			>
				{files.length >= 10 || <FileInputButton onError={(err) => alert(err)} onAttach={(newFile) => setFiles(prev => [...prev, newFile])} />}
			</FileList>

			<Button isLoading={isSearchLoading} isDisabled={!messageValue} colorScheme="blue" variant={'outline'}
				mr={3}
				onClick={() => {
					//request
					setSearchLoading(true)
					setTimeout(() => {
						router.push('/')
						setSearchLoading(false)
					}, 200)
				}}>
				Отправить
			</Button>
		</Stack>
	)
}

export default MessagePage