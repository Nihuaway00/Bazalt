import { useEffect } from 'react'
import RootLayout from '../layouts/layout'
import '../styles/global.css'

export default function MyApp({ Component, pageProps }) {

	return (
		<RootLayout>
			<Component {...pageProps} />
		</RootLayout>
	)
}
