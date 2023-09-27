import {Container, Heading, Text} from '@chakra-ui/react'

const ChatNull = () => {
	return (
		<Container minWidth={'300px'} opacity={'0.5'} userSelect={'none'} borderRadius="md"
				   border={'1px'} borderColor={'gray.200'} justifyContent={'center'}
				   align={'center'} padding={'8px'}>
			<Heading size="sm">Пусто...</Heading>
			<Text fontSize={'sm'}>Создайте чат или напишите кому-нибудь</Text>
		</Container>
	)
}

export default ChatNull