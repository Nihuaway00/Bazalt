import { ChatIcon, CopyIcon, CloseIcon, DeleteIcon, HamburgerIcon, SmallCloseIcon } from "@chakra-ui/icons"
import { Avatar, AvatarBadge, Box, AvatarGroup, GenericAvatarIcon, Heading, Menu, MenuButton, MenuItem, MenuList, Stack, Text } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"


const MessageItem = ({ message }) => {
	const router = useRouter()
	console.log(message)
	const [isSelected, setSelected] = useState(false)
	const [date, setDate] = useState(null)

	// useEffect(() => {
	// 	if (!message) return
	// 	let k = new Date().setTime(message.sentAt)
	// 	alert(k.getDay())
	// }, [message])

	return (
		<Stack direction={"row"} spacing={4} align={"stretch"} padding={"8px 12px"} bg={isSelected ? "gray.200" : "transparent"}>
			<Stack height={"100%"} justify={"center"} cursor={"pointer"}>
				<Avatar size={"sm"} src={"/fdf.jpg"} />
			</Stack>
			<Stack onClick={() => setSelected(prev => !prev)} spacing={2} cursor={"pointer"}>
				<Heading size={"xs"}>{message.userID}</Heading>
				<Stack direction={"row"}>
					<Text fontSize={"sm"}>{message.value}</Text>
				</Stack>
			</Stack>
			<Stack justify={"space-between"} align={"end"}>
				{isSelected ? <Menu>
					{
						({ isOpen }) => (
							<>
								<MenuButton isOpen={isOpen}>

									{isOpen ? <SmallCloseIcon /> : <HamburgerIcon />}
								</MenuButton>
								<MenuList>
									<MenuItem icon={<CopyIcon />}>Копировать</MenuItem>
									<MenuItem icon={<ChatIcon />}>Ответить</MenuItem>
								</MenuList>
							</>

						)
					}

				</Menu> : <Box height="24px" />}
				<Text userSelect={"none"} fontSize={"xs"} whiteSpace={"nowrap"}>{ }</Text>
			</Stack>
		</Stack>
	)
}

export default MessageItem