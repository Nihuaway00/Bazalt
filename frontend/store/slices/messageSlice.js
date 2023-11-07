import { createSlice } from "@reduxjs/toolkit";

export const messageSlice = createSlice({
	name: 'messages',
	initialState: null,
	reducers: {
		set: (state, action) => {
			return action.payload
		},
		add: (state, action) => {
			if (!state) return action.payload
			return [action.payload, ...state]
		},
		remove: (state, action) => {

		},
		edit: (state, action) => {

		}

	}
})

export const addMessageAction = (message) => messageSlice.actions.add(message)
export const setMessageAction = (messages) => messageSlice.actions.set(messages)

export default messageSlice.reducer