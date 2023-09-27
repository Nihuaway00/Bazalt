import {
	useEffect,
	useState,
	createContext,
} from "react"
import { io } from "socket.io-client"
import { CacheProvider } from "@chakra-ui/next-js"
import { ChakraProvider } from "@chakra-ui/react"

export const SocketContext = createContext()
export const UserContext = createContext()

export function Providers({
	children
}) {
	const [socket, setSocket] = useState(null)
	const [user, setUser] = useState(null)

	useEffect(() => {
		const sessionID = localStorage.getItem("sessionID")
		if (!sessionID) return

		const s = io("http://localhost:8000", {
			extraHeaders: {
				sessionID: localStorage.getItem("sessionID"),
			},
		})
		setSocket(s)
	}, [])

	return (
		<CacheProvider>
			<ChakraProvider>
				<UserContext.Provider value={{ user, setUser }}>
					<SocketContext.Provider value={{ socket }}>
						{children}
					</SocketContext.Provider>
				</UserContext.Provider>
			</ChakraProvider>
		</CacheProvider>
	)
}