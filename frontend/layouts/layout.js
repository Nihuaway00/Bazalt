import { Container } from "@chakra-ui/react"

export default function RootLayout({
	children,
}) {

	return (
		<Container maxWidth="600px" padding="32px 0 32px 0" height={"100vh"}>
			{children}
		</Container>
	)
}