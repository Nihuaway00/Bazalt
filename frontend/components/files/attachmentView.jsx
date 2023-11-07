import { Avatar, AvatarBadge, Box, Center, AvatarGroup, GenericAvatarIcon, Heading, Menu, MenuButton, Container, Wrap, MenuItem, MenuList, Stack, Text } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import ImageNext from 'next/image'
import ImageType from "./types/imageType"
import FileType from "./types/fileType"
import { SunIcon } from "@chakra-ui/icons"

const AttachmentView = ({ path }) => {
	const [preview, setPreview] = useState(null)
	const [src, setSrc] = useState(null)
	const [type, setType] = useState(null)
	const [filename, setFilename] = useState(null)

	useEffect(() => {
		if (!path) return

		const url = `http://127.0.0.1:9000/${path}`

		const request = new XMLHttpRequest()
		request.open('GET', url, true)
		request.responseType = 'blob'
		request.onload = () => {
			const { type } = request.response
			setType(type)
			setSrc(url)
			setFilename(path.split('/').pop())
		}
		request.send()
	}, [path])

	useEffect(() => {
		if (!type || !src) return

		if (type.match('image')) {
			// const img = new Image()
			// img.src = src
			// const size = 150
			// // const k = img.width / img.height || 1
			setPreview({
				src,
				width: 75,
				height: 75
			})
		}
		else if (type.match('video')) {
			const video = document.createElement('video')
			video.src = src
			video.crossOrigin = 'anonymous'
			console.log(src);
			video.addEventListener('loadeddata', e => {
				const canvas = document.createElement('canvas')
				canvas.width = e.target.videoWidth
				canvas.height = e.target.videoHeight
				const context = canvas.getContext('2d');
				context.drawImage(video, 0, 0, canvas.width, canvas.height);
				// const k = canvas.width / canvas.height || 1

				const dataURL = canvas.toDataURL();
				setPreview({
					src: dataURL,
					width: 75,
					height: 75
				})
			})
		}
	}, [type, src])


	if (!type || !src) {
		return (
			<Center borderRadius={4} width={75} height={75} position={'relative'}>
				<SunIcon />
			</Center>
		)
	}


	if (!preview) return <FileType filename={filename} />

	return (
		<Center borderRadius={4} overflow='hidden' width={preview.width} height={preview.height} position={'relative'}>
			<ImageNext src={preview.src} fill alt="" objectFit="cover" />
		</Center>
	)
}

export default AttachmentView