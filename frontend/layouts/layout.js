import { Container } from "@chakra-ui/react"
import { Providers } from "./providers"
import Authorized from "../middlewares/authorizedMiddleware"
import { RefreshMiddleware } from "../middlewares/refreshMiddleware"
import { SocketMiddleware } from "../middlewares/socketMiddleware"

export default function RootLayout({
	children,
}) {


	return (
		<Providers>
			<Container maxWidth="600px" padding="32px 0 32px 0" height={"100vh"}>
				<RefreshMiddleware>
					<SocketMiddleware>
						<Authorized passUrls={['/auth/*']}>

							{children}
						</Authorized>
					</SocketMiddleware>
				</RefreshMiddleware>

			</Container>
		</Providers>
	)
}