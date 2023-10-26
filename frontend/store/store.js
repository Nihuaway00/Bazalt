import { configureStore } from '@reduxjs/toolkit'

import userReducer from './slices/userSlice'
import socketReducer from './slices/socketSlice'
import chatReducer from './slices/chatSlice'

const store = configureStore({
	reducer: {
		user: userReducer,
		socket: socketReducer,
		chats: chatReducer
	},
	devTools: true
})

export { store }