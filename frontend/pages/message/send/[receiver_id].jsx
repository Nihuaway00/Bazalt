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
import {AddIcon, ArrowBackIcon, CloseIcon, SearchIcon} from '@chakra-ui/icons'
import {useState} from 'react'
import {useRouter} from 'next/router'
import ImageNext from 'next/image'

const MessagePage = () => {
	const router = useRouter()
	const [searchValue, setSearchValue] = useState('')
	const [isSearchLoading, setSearchLoading] = useState(false)

	const [receiverID, setReceiverID] = useState(null)
	const [messageValue, setMessageValue] = useState('')

	const [files, setFiles] = useState([])


	return (
		<Stack spacing={6} align={'center'} height={'100%'} paddingTop={'128px'}>
			<Button onClick={() => router.push('/message')} size={'sm'} leftIcon={<ArrowBackIcon/>} variant={'link'}>
				<Text>Назад</Text>
			</Button>
			<Heading size="lg" userSelect={'none'}>Можете писать</Heading>
			<Textarea onChange={(e) => setMessageValue(e.target.value)} isRequired={true}
					  placeholder="Теперь пишите сообщение..."
					  type="email"/>
			<Wrap margin={'0 0 0 0'} direction={'row'} width={'100%'}>
				{
					files.map(({src, width, height}, index) => {

						const k = width / height
						return (
							<WrapItem key={index}>
								<Center borderRadius={6} overflow={'hidden'} position={'relative'} width={`${40 * k}px`}
									height={'40px'}>
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
				
				<FormLabel position={'relative'} height={'40px'} width={'40px'} border={'1px rgba(0,0,0,0.1) solid'}
						   borderRadius={6}>
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
					<Center width={'100%'} height={'100%'}>
						<AddIcon color={'gray.400'}/>
					</Center>
				</FormLabel>


			</Wrap>
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