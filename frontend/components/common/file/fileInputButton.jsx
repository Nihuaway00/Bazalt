import { Center, FormLabel } from "@chakra-ui/react"
import FileInput from "./fileInput"
import { AddIcon } from "@chakra-ui/icons"

const FileInputButton = ({ onAttach, onError }) => {
	return (
		<FormLabel position={'relative'} height={'40px'} width={'40px'} border={'1px rgba(0,0,0,0.1) solid'}
			borderRadius={6}>
			<FileInput maxSize='209715200' onError={onError} onAttach={onAttach} />
			<Center width={'100%'} height={'100%'}>
				<AddIcon color={'gray.400'} />
			</Center>
		</FormLabel>
	)
}

export default FileInputButton