import {Button, Heading, Input, InputGroup, InputLeftElement, Stack, Text} from '@chakra-ui/react'
import {ArrowBackIcon, SearchIcon} from '@chakra-ui/icons'
import {useState} from 'react'
import {useRouter} from 'next/router'

const MessagePage = () => {
	const router = useRouter()
	const [searchValue, setSearchValue] = useState('')
	const [isSearchLoading, setSearchLoading] = useState(false)

	const [receiverID, setReceiverID] = useState(null)
	const [messageValue, setMessageValue] = useState('')

	return (
		<Stack spacing={6} align={'center'} height={'100%'} paddingTop={'128px'}>
			<Button onClick={() => router.push('/')} size={'sm'} leftIcon={<ArrowBackIcon/>} variant={'link'}>
				<Text>Список чатов</Text>
			</Button>
			<Heading size="lg" userSelect={'none'}>Найдите, кому написать</Heading>
			<InputGroup width={'350px'}>
				<InputLeftElement>
					<SearchIcon/>
				</InputLeftElement>
				<Input onChange={(e) => setSearchValue(e.target.value)} isRequired={true}
					   placeholder="Тег пользователя без собаки"
					   type="email"/>

			</InputGroup>
			<Button isDisabled={!searchValue} isLoading={isSearchLoading} colorScheme="blue" variant={'outline'}
				mr={3}
				onClick={() => {
					//request
					setSearchLoading(true)
					setTimeout(() => {
						router.push('/message/send/' + 'userID')
						setSearchLoading(false)
					}, 200)
				}}>
				Найти
			</Button>
		</Stack>
	)
}

export default MessagePage