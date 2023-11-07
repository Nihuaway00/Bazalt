import { ChatIcon, CopyIcon, CloseIcon, DeleteIcon, HamburgerIcon, SmallCloseIcon, CheckIcon } from "@chakra-ui/icons"
import { Avatar, AvatarBadge, Box, Center, AvatarGroup, GenericAvatarIcon, Heading, Menu, MenuButton, Container, Wrap, MenuItem, MenuList, Stack, Text } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import AttachmentView from "../../files/attachmentView"
import { useGetUser } from "../../../hooks/user/useGetUser"

// const FilePreview = ({ filename }) => {
// 	const nameArr = filename.split('.')
// 	const type = nameArr.pop()

// 	return (
// 		<Stack spacing='0' padding='0 6px' maxWidth='inherit'>
// 			<Text fontSize='xs' text-overflow='ellipsis' width='100%' noOfLines={1}>{nameArr.join('.')}</Text>
// 			<Text fontSize='xs' text-overflow='ellipsis' width='100%' noOfLines={1}>.{type}</Text>
// 		</Stack>
// 	)
// }


const MessageItem = ({ userID, value, isSelf, id, hasAttachments, editAt, isReplyTo, sentAt, attachments }) => {
	const router = useRouter()
	const onGetUser = useGetUser(userID)
	const [isSelected, setSelected] = useState(false)
	const [username, setUsername] = useState(null)

	useEffect(() => {
		if (!onGetUser.data) return
		setUsername(onGetUser.data.user.name)
	}, [onGetUser.data])

	return (
		<Stack direction='row' align='end'>
			<Avatar size={"sm"} src={"/fdf.jpg"} />
			<Stack bg={isSelf ? "pink.100" : 'transparent'} border={'1px solid rgba(0,0,0,0.1)'} padding='6px 10px 10px 10px' borderRadius={6} spacing={4} direction='row' align='end'>
				<Stack>
					<Heading size={"xs"}>{username}</Heading>
					<Stack>
						<Text whiteSpace='balance' fontSize={"sm"}>{value}</Text>
						<Wrap>
							{
								attachments.map((attachment) => {
									return <AttachmentView key={attachment._id} path={attachment.path} />
								})
							}
						</Wrap>
					</Stack>
				</Stack>
				<Stack direction='row' align='center'>
					{/* {!isSelf || <CheckIcon boxSize={"10px"} />} */}
					<Text userSelect={"none"} fontSize='xs' whiteSpace={"nowrap"}>{
						new Date(sentAt.seconds * 1000).toLocaleString('ru', {
							hour: 'numeric',
							minute: 'numeric'
						})

					}</Text>
				</Stack>
			</Stack>
		</Stack>
	)
}

export default MessageItem