import {
	useEffect,
	useState,
	createContext,
} from "react"
import { io } from "socket.io-client"
import { CacheProvider } from "@chakra-ui/next-js"
import { ChakraProvider } from "@chakra-ui/react"

import store from '../store/store'
import { Provider } from "react-redux"
import AuthRoute from "../routes/authRoute"
import { set } from "../store/slices/userSlice"

export const SocketContext = createContext()
export const UserContext = createContext()

export function Providers({
	children
}) {
	const [socket, setSocket] = useState(null)

	useEffect(() => {
		const sessionID = localStorage.getItem("sessionID")
		const refresh = async () => await AuthRoute.refresh()
		refresh().then(({ user }) => {
			store.dispatch(set(user))
		}).catch(err => {
			store.dispatch(set({ unauthorized: true }))
		})

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
				<Provider store={store}>
					<SocketContext.Provider value={{ socket }}>
						{children}
					</SocketContext.Provider>
				</Provider>
			</ChakraProvider>
		</CacheProvider>
	)
}