import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Divider
} from '@chakra-ui/react'

const ModalSample = ({ isOpen, onClose, children, header }) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose} motionPreset='slideInBottom'>
			<ModalOverlay backdropFilter='blur(10px)' />
			<ModalContent>
				<ModalHeader>{header}</ModalHeader>
				<ModalCloseButton />
				<Divider />
				{
					children
				}
			</ModalContent>
		</Modal>
	)
}

export default ModalSample