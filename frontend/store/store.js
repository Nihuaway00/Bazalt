import { configureStore } from '@reduxjs/toolkit'

import userReducer from './slices/userSlice'
import socketReducer from './slices/socketSlice'
import chatReducer from './slices/chatSlice'
import messageReducer from './slices/messageSlice'

const store = configureStore({
	reducer: {
		user: userReducer,
		socket: socketReducer,
		chats: chatReducer,
		messages: messageReducer
	},
	devTools: true
})

export { store }