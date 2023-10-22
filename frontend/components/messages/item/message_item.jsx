import { ChatIcon, CopyIcon, CloseIcon, DeleteIcon, HamburgerIcon, SmallCloseIcon, CheckIcon } from "@chakra-ui/icons"
import { Avatar, AvatarBadge, Box, Center, AvatarGroup, GenericAvatarIcon, Heading, Menu, MenuButton, Container, Wrap, MenuItem, MenuList, Stack, Text } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import ImageNext from 'next/image'
import FileView from "../../files/fileView"

const FilePreview = ({ filename }) => {
	const nameArr = filename.split('.')
	const type = nameArr.pop()

	return (
		<Stack spacing='0' padding='0 6px' maxWidth='inherit'>
			<Text fontSize='xs' text-overflow='ellipsis' width='100%' noOfLines={1}>{nameArr.join('.')}</Text>
			<Text fontSize='xs' text-overflow='ellipsis' width='100%' noOfLines={1}>.{type}</Text>
		</Stack>
	)
}


const MessageItem = ({ userID, value, isSelf, id, hasAttachments, editAt, isReplyTo, sentAt, attachmets }) => {
	const router = useRouter()
	const [isSelected, setSelected] = useState(false)
	const [date, setDate] = useState(null)
	const [loadedAttachments, setLoadedAttachments] = useState([])


	// useEffect(() => {
	// 	if (!sentAt) return
	// 	let k = new Date().setTime(333)
	// }, [sentAt])

	useEffect(() => {
		if (!attachmets) return
		attachmets.map(({ src, filename }) => {
			const request = new XMLHttpRequest()
			request.open('GET', src, true)
			request.responseType = 'blob'
			request.onload = () => {
				const { type } = request.response
				setLoadedAttachments(prev => [...prev, {
					type: type.split('/', 1)[0],
					src,
					filename
				}])
			}
			request.send()
		})
	}, [attachmets])

	return (
		<Stack direction='row' align='end'>
			<Avatar size={"sm"} src={"/fdf.jpg"} />
			<Stack bg={isSelf ? "pink.100" : 'transparent'} border={'1px solid rgba(0,0,0,0.1)'} padding='6px 10px 10px 10px' borderRadius={6} spacing={4} direction='row' align='end'>
				<Stack>
					<Heading size={"xs"}>{userID}</Heading>
					<Stack>
						<Text whiteSpace='balance' fontSize={"sm"}>{value}</Text>
						<Wrap>
							{
								loadedAttachments.map(({ type, src, filename }) => {
									return <FileView key={src.slice(10, 20)} type={type} src={src} filename={filename} />
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
		// <Stack direction={"row"} maxWidth='90%' borderRadius={6} spacing={4} align={"stretch"} padding={"8px 12px"} bg={"gray.200"}>
		// 	<Stack height={"100%"} justify={"center"} cursor={"pointer"}>
		// 		<Avatar size={"sm"} src={"/fdf.jpg"} />
		// 	</Stack>
		// 	<Stack onClick={() => setSelected(prev => !prev)} spacing={2} cursor={"pointer"}>
		// 		<Heading size={"xs"}>{userID}</Heading>
		// 		<Stack direction={"row"}>
		// 			<Text fontSize={"sm"}>{value}</Text>
		// 		</Stack>
		// 	</Stack>
		// 	<Stack justify={"space-between"} align={"end"}>
		// 		{isSelected ? <Menu>
		// 			{
		// 				({ isOpen }) => (
		// 					<>
		// 						<MenuButton isOpen={isOpen}>

		// 							{isOpen ? <SmallCloseIcon /> : <HamburgerIcon />}
		// 						</MenuButton>
		// 						<MenuList>
		// 							<MenuItem icon={<CopyIcon />}>Копировать</MenuItem>
		// 							<MenuItem icon={<ChatIcon />}>Ответить</MenuItem>
		// 						</MenuList>
		// 					</>

		// 				)
		// 			}

		// 		</Menu> : <Box height="24px" />}
		// 		<Text userSelect={"none"} fontSize={"xs"} whiteSpace={"nowrap"}>{ }</Text>
		// 	</Stack>
		// </Stack>
	)
}

export default MessageItem