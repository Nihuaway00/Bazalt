import { configureStore } from '@reduxjs/toolkit'

import userReducer from './slices/userSlice'
import socketReducer from './slices/socketSlice'

const store = configureStore({
	reducer: {
		user: userReducer,
		socket: socketReducer
	},
	devTools: true
})

export { store }