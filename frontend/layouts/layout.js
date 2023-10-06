import { Container } from "@chakra-ui/react"
import { Providers } from "./providers"
import Authorized from "../middlewares/authorized"

export default function RootLayout({
	children,
}) {
	return (
		<Providers>
			<Container maxWidth="600px" padding="32px 0 32px 0" height={"100vh"}>
				<Authorized passUrls={['/auth/*']}>
					{children}
				</Authorized>
			</Container>
		</Providers>
	)
}