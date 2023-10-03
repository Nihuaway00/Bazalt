import { SpinnerIcon } from "@chakra-ui/icons"
import { Modal, ModalContent, ModalOverlay, ModalBody, Center } from "@chakra-ui/react"

const LoadingModal = () => {
	return (
		<Modal isCentered isOpen={true} onClose={() => { }}>
			<ModalOverlay backdropFilter='blur(10px)' />
			<ModalContent width='64px'>
				<ModalBody padding='24px'>
					<Center>
						<SpinnerIcon boxSize='16px' />
					</Center>
				</ModalBody>
			</ModalContent>
		</Modal>
	)
}

export default LoadingModal