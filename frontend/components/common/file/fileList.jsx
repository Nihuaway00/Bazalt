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
import { AddIcon, ArrowBackIcon, CloseIcon, SearchIcon } from '@chakra-ui/icons'
import { useEffect, useState } from 'react'
import ImageNext from 'next/image'

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

const FileList = ({ files, onRemove, children }) => {
	return (
		<Wrap margin={'0 0 0 0'} direction={'row'} width={'100%'}>
			{
				files.map(({ preview, name }, index) => {
					return (
						<WrapItem key={index}>
							<Center maxWidth={preview ? '300px' : '60px'} borderRadius={6} overflow={'hidden'} position={'relative'} width={preview ? `${40 * (preview.width / preview.height)}px` : 'auto'}
								height={'40px'}>
								{
									preview ? <ImageNext src={preview.src} fill={true} alt="" objectFit="contain" /> : <FilePreview filename={name} />
								}

								<Center position={'absolute'} top={0} bottom={0} right={0} left={0}
									bg={'rgba(0,0,0,0.2)'}>
									<CloseIcon cursor={'pointer'} onClick={() => {
										onRemove(index)
									}} color={'white'} />
								</Center>
							</Center>
						</WrapItem>

					)
				})
			}
			{children}
		</Wrap>
	)
}

export default FileList