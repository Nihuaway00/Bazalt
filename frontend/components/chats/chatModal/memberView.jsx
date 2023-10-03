import { CloseIcon } from "@chakra-ui/icons"
import { Avatar, Stack, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"

const MemberView = ({ memberID, userID }) => {
	const [avatarSrc, setAvatarSrc] = useState(null)
	const [name, setName] = useState('')

	useEffect(() => {
		if (!userID) return
		//request to avatar by userID

		setTimeout(() => {
			setAvatarSrc('/3.jpg')
			setName('Мухамед')
		}, 300)
	}, [userID])

	return (
		<Stack key={memberID} direction='row' align='center' justify='space-between'>
			<Stack direction='row' align='center'>
				<Avatar userSelect='none' size='xs' src={avatarSrc} />
				<Stack>
					<Text fontSize='sm'>{name}</Text>
				</Stack>
			</Stack>
			<Stack>
				<CloseIcon boxSize='12px' opacity={0.5} />
			</Stack>
		</Stack>
	)
}

export default MemberView