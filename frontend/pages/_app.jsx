
import { Provider, useDispatch } from 'react-redux'
import RootLayout from '../layouts/layout'
import { store } from '../store/store'
import '../styles/global.css'
import AuthRoute from '../routes/authRoute'
import { useEffect } from 'react'
import { setUser, unauthorized } from '../store/slices/userSlice'
import { io } from 'socket.io-client'
import { socketConnect } from '../store/slices/socketSlice'
import { Providers } from '../layouts/providers'
import { Middlewares } from '../layouts/middlewares'


export default function MyApp({ Component, pageProps }) {
	const dispatch = store.dispatch

	useEffect(() => {
		const sessionID = localStorage.getItem("sessionID")
		if (!sessionID) return

		const onRefresh = async () => await AuthRoute.refresh()

		onRefresh().then(({ data }) => {
			dispatch(setUser(data.user))
		}).catch(err => {
			dispatch(unauthorized())
			alert('refresh:' + err.message)
		})

		const socket = io("http://localhost:8000", {
			extraHeaders: { sessionID }
		})
	}, [])

	return (
		<Providers>
			<RootLayout>
				<Middlewares>
					<Component {...pageProps} />
				</Middlewares>
			</RootLayout>

		</Providers>

	)
}
