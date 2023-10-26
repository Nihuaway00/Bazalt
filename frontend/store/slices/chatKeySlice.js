import { createSlice } from "@reduxjs/toolkit";

export const ChatKeySlice = createSlice({
	name: 'chats',
	initialState: [],
	reducers: {
		add: (state, action) => {
			return [...state, action.payload]
		},
		set: (state, action) => {
			if (state.filter(key => key.chatID === action.payload.chatID).length === 0) {
				return [...state, action.payload]
			}

			return state.map(key => {
				if (key.chatID === action.payload.chatID) {
					return action.payload
				}
				return key
			})
		},
		remove: (state, action) => {
			return state.filter(key => key.id !== action.payload.id)
		}

	}
})

export const addChatKeyAction = (chatID, key) => ChatKeySlice.actions.add({ chatID, key })
export const setChatKeyAction = (chatID, key) => ChatKeySlice.actions.set({ chatID, key })
export const removeChatKeyAction = (chatID) => ChatKeySlice.actions.remove({ chatID })


export default ChatKeySlice.reducer