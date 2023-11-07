import { Input } from "@chakra-ui/react"
import MessageRoute from "../../../routes/messageRoute"

const FileInput = ({ onAttach, maxSize, onError }) => {
	return (
		<Input onChange={(e) => {
			const file = e.target.files[0]

			if (file.size > maxSize) {
				return onError('File is too large')
			}
			const fr = new FileReader()

			fr.onloadend = (e) => {
				const data = new Uint8Array(e.srcElement.result)

				if (file.type.match('image')) {
					var img = new Image()
					img.src = window.URL.createObjectURL(file)

					img.onload = (({ srcElement }) => {
						const newFile = {
							preview: {
								src: srcElement.src,
								width: srcElement.width,
								height: srcElement.height
							},
							data,
							type: file.type,
							name: file.name,
							size: file.size
						}
						onAttach(newFile)

					})
				}
				else if (file.type.match('video')) {
					const video = document.createElement('video')
					video.src = window.URL.createObjectURL(file)

					video.addEventListener('loadeddata', e => {
						const canvas = document.createElement('canvas')
						canvas.width = e.target.videoWidth
						canvas.height = e.target.videoHeight

						const context = canvas.getContext('2d');

						context.drawImage(video, 0, 0, canvas.width, canvas.height);

						const dataURL = canvas.toDataURL();
						const newFile = {
							preview: {
								src: dataURL,
								width: canvas.width,
								height: canvas.height
							},
							data,
							name: file.name,
							size: file.size,
							type: file.type,
						}
						onAttach(newFile)
					})
				}
				else {
					const reader = new FileReader()
					reader.onload = function (e) {
						const newFile = {
							preview: null,
							data: e.target.result,
							name: file.name,
							type: `file/${file.name.split('.').pop()}`,
							size: file.size
						}
						console.log(newFile);
						onAttach(newFile)
					};
					reader.readAsText(file)
				}
			}
			fr.readAsArrayBuffer(file)



		}
		} position={'absolute'} top={0} left='0' bottom='0' right='0' opacity={0} type="file" cursor={'pointer'} />
	)
}

export default FileInput