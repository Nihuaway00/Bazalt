import { configureStore } from '@reduxjs/toolkit'

import userReducer from './slices/userSlice'
import socketReducer from './slices/socketSlice'
import chatKeyReducer from './slices/chatKeySlice'

const store = configureStore({
	reducer: {
		user: userReducer,
		socket: socketReducer,
		chatKeys: chatKeyReducer
	},
	devTools: true
})

export { store }