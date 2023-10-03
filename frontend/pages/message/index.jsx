import { Button, Heading, Input, InputGroup, InputLeftElement, Stack, Text } from '@chakra-ui/react'
import { ArrowBackIcon, SearchIcon } from '@chakra-ui/icons'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const MessagePage = () => {
	const router = useRouter()
	const [searchValue, setSearchValue] = useState('')
	const [isSearchLoading, setSearchLoading] = useState(false)
	const [isInvalid, setInvalid] = useState(false)


	useEffect(() => {
		const re = new RegExp(/[^\w\s]/, 'gi')
		setInvalid(!!searchValue.match(re))
	}, [searchValue])

	return (
		<Stack spacing={6} align={'center'} height={'100%'} paddingTop={'128px'}>
			<Button onClick={() => router.push('/')} size={'sm'} leftIcon={<ArrowBackIcon />} variant={'link'}>
				<Text>Список чатов</Text>
			</Button>
			<Heading size="lg" userSelect={'none'}>Поиск пользователя</Heading>
			<Stack>
				{!isInvalid || <Text marginLeft='8px' color='red'>Только латинские буквы и цифры</Text>}
				<InputGroup width={'350px'}>
					<InputLeftElement>
						<SearchIcon />
					</InputLeftElement>
					<Input isInvalid={isInvalid} onChange={(e) => setSearchValue(e.target.value)} isRequired={true}
						placeholder="Тег пользователя без собаки"
						type="email" />

				</InputGroup>

			</Stack>
			<Button isDisabled={!searchValue || isInvalid} isLoading={isSearchLoading} colorScheme="blue" variant={'outline'}
				mr={3}
				onClick={() => {
					//request
					setSearchLoading(true)
					setTimeout(() => {

						if (searchValue === 'undefined') {
							alert('Пользователь не найден')
							setSearchLoading(false)
							return
						}

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