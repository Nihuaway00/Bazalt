import { Avatar, AvatarBadge, Box, Center, AvatarGroup, GenericAvatarIcon, Heading, Menu, MenuButton, Container, Wrap, MenuItem, MenuList, Stack, Text } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import ImageNext from 'next/image'
import ImageType from "./types/imageType"
import FileType from "./types/fileType"

const FileView = ({ type, src, filename }) => {
	const [preview, setPreview] = useState(null)

	useEffect(() => {
		if (!type || !src) return

		if (type === 'image') {
			const img = new Image()
			img.src = src
			const size = 150
			const k = img.width / img.height || 1

			setPreview({
				src,
				width: size,
				height: size * k
			})
		}
		else if (type === 'video') {
			const video = document.createElement('video')
			video.src = src
			video.crossOrigin = 'anonymous'

			video.addEventListener('loadeddata', e => {
				const canvas = document.createElement('canvas')
				canvas.width = e.target.videoWidth
				canvas.height = e.target.videoHeight
				const size = 150
				const context = canvas.getContext('2d');
				context.drawImage(video, 0, 0, canvas.width, canvas.height);
				const k = canvas.width / canvas.height || 1

				const dataURL = canvas.toDataURL();
				console.log(dataURL);

				setPreview({
					src: dataURL,
					width: size,
					height: size * k
				})
			})
		}
	}, [type, src])

	if (!preview) return <FileType filename={filename} />

	return <ImageType src={preview.src} width={preview.width} height={preview.height} />
}

export default FileView