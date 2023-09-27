import { Container } from "@chakra-ui/react"
import { Providers } from "./providers"

export default function RootLayout({
	children,
}) {
	return (
		<Providers>
			<Container padding="64px 0 64px 0" height={"100vh"}>
				{children}
			</Container>
		</Providers>
	)
}