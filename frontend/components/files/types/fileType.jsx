import { Avatar, AvatarBadge, Box, Center, AvatarGroup, GenericAvatarIcon, Heading, Menu, MenuButton, Container, Wrap, MenuItem, MenuList, Stack, Text } from "@chakra-ui/react"
import ImageNext from 'next/image'


const FileType = ({ filename }) => {
	const nameArr = filename.split('.')
	const type = nameArr.pop()

	return (
		<Center padding="4px 6px" borderRadius={4} border='1px solid rgba(0,0,0,0.1)' width='min-content' userSelect='none'>
			<Stack spacing='0' padding='0 6px' maxWidth='inherit'>
				<Text fontSize='xs' text-overflow='ellipsis' width='100%' noOfLines={1}>{nameArr.join('.')}</Text>
				<Text fontSize='xs' text-overflow='ellipsis' width='100%' noOfLines={1}>.{type}</Text>
			</Stack>
		</Center>
	)
}

export default FileType