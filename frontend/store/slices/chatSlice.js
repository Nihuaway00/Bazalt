import { createSlice } from "@reduxjs/toolkit";

export const chatSlice = createSlice({
	name: 'chats',
	initialState: [],
	reducers: {
		set: (state, action) => {
			if (state.filter(chat => chat._id === action.payload._id).length === 0) {
				return [...state, action.payload]
			}

			return state.map(chat => {
				if (chat._id === action.payload._id) {
					return action.payload
				}
				return chat
			})
		},
		remove: (state, action) => {
			return state.filter(chat => chat._id !== action.payload._id)
		}

	}
})

export const setChatAction = (chat) => chatSlice.actions.set(chat)
export const removeChatAction = (_id) => chatSlice.actions.remove({ _id })


export default chatSlice.reducer