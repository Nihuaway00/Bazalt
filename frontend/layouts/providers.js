import { CacheProvider } from "@chakra-ui/next-js"
import { ChakraProvider } from "@chakra-ui/react"

import { store } from '../store/store'
import { Provider } from "react-redux"

import {
	QueryClient,
	QueryClientProvider,
} from 'react-query';

const queryClient = new QueryClient();

export function Providers({
	children
}) {
	return (

		<CacheProvider>
			<ChakraProvider>
				<QueryClientProvider client={queryClient}>
					<Provider store={store}>
						{children}
					</Provider>
				</QueryClientProvider>
			</ChakraProvider>
		</CacheProvider>
	)
}