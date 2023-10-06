import { Button, Heading, Input, InputGroup, InputLeftElement, Stack, Text, Avatar, FormLabel, Center } from '@chakra-ui/react'
import { ArrowBackIcon, PlusSquareIcon, SearchIcon, AddIcon } from '@chakra-ui/icons'
import { useState } from 'react'
import { useRouter } from 'next/router'
import AvatarImage from 'next/image'
import FileInput from '../components/common/file/fileInput'

const NewChatPage = () => {
	const router = useRouter()
	const [title, setTitle] = useState('')
	const [avatar, setAvatar] = useState(null)
	const [isCreating, setCreating] = useState(false)


	const onCreate = async () => {
		setCreating(true)

		setTimeout(() => {
			router.push('/')
			setCreating(false)
		}, 200)
	}

	return (
		<Stack spacing={6} align={'center'} height={'100%'} paddingTop={'128px'}>
			<Button onClick={() => router.push('/')} size={'sm'} leftIcon={<ArrowBackIcon />} variant={'link'}>
				<Text>Список чатов</Text>
			</Button>
			<Heading size="lg" userSelect={'none'}>Создать чат</Heading>
			<Stack direction='row' align='center' spacing='4'>
				<FormLabel cursor='pointer' overflow='hidden' margin='0' position={'relative'} height={'50px'} width={'50px'} align='center' justifyContent='center' border={'1px rgba(0,0,0,0.1) solid'}
					borderRadius={'100%'}>
					<Input onChange={(e) => {
						var img = new Image()
						img.src = window.URL.createObjectURL(e.target.files[0])
						img.onload = ({ srcElement }) => {
							setAvatar({
								src: srcElement.src,
								width: srcElement.naturalWidth,
								height: srcElement.naturalHeight
							})
						}
					}} position={'absolute'} opacity={0} type="file" variant={'outline'} cursor={'pointer'} />
					<Center width={'100%'} height={'100%'} position='relative'>
						{avatar ? <AvatarImage src={avatar.src} fill objectFit='cover' /> : <AddIcon color={'gray.400'} />}
					</Center>
				</FormLabel>
				<InputGroup width={'350px'}>
					<Input onChange={(e) => setTitle(e.target.value)} isRequired={true}
						placeholder="Имя чата" />
				</InputGroup>
			</Stack>
			<Button isDisabled={!title} isLoading={isCreating} colorScheme="blue" variant={'outline'}
				onClick={onCreate}>
				Создать
			</Button>
		</Stack>
	)
}

export default NewChatPage