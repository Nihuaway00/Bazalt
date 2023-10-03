import { Container } from "@chakra-ui/react"
import { Providers } from "./providers"

export default function RootLayout({
	children,
}) {
	return (
		<Providers>
			<Container maxWidth="600px" padding="32px 0 32px 0" height={"100vh"}>
				{children}
			</Container>
		</Providers>
	)
}