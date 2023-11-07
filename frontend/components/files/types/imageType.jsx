import { Avatar, AvatarBadge, Box, Center, AvatarGroup, GenericAvatarIcon, Heading, Menu, MenuButton, Container, Wrap, MenuItem, MenuList, Stack, Text } from "@chakra-ui/react"
import ImageNext from 'next/image'

const ImageType = ({ src, width, height }) => {
	return (
		<Center borderRadius={4} overflow='hidden' width={width} height={height} position={'relative'}>
			<ImageNext maxwidth={200} minwidth={75} src={src} fill alt="" objectFit="cover" />
		</Center>
	)
}

export default ImageType