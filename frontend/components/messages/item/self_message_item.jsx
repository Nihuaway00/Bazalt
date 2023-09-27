import { ChatIcon, CloseIcon, CopyIcon, DeleteIcon, EditIcon, HamburgerIcon, SmallCloseIcon } from "@chakra-ui/icons"
import { Avatar, AvatarBadge, AvatarGroup, Box, GenericAvatarIcon, Heading, Menu, MenuButton, MenuItem, MenuList, Stack, Text } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { useState } from "react"


const SelfMessageItem = (message) => {
	const router = useRouter()
	const [isSelected, setSelected] = useState(false)

	return (
		<Stack direction={"row"} spacing={4} align={"stretch"} padding={"8px 12px 8px 60px"} bg={isSelected ? "gray.200" : "transparent"}>
			<Stack onClick={() => setSelected(prev => !prev)} spacing={2} cursor={"pointer"}>
				<Stack direction={"row"}>
					<Text fontSize={"sm"} noOfLines={2}>{"Паша" + ": "}В чате будет 3 статуса пользователей: Создатель, Администратор и обычный</Text>
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
									<MenuItem icon={<DeleteIcon />}>Удалить (для всех)</MenuItem>
									<MenuItem icon={<EditIcon />}>Изменить</MenuItem>
									<MenuItem icon={<CopyIcon />}>Копировать</MenuItem>
									<MenuItem icon={<ChatIcon />}>Ответить</MenuItem>
								</MenuList>
							</>

						)
					}

				</Menu> : <Box height="24px" />}
				<Text userSelect={"none"} fontSize={"xs"} whiteSpace={"nowrap"}>23 августа</Text>
			</Stack>
		</Stack>
	)
}

export default SelfMessageItem