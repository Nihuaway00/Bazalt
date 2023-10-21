import { createSlice } from "@reduxjs/toolkit";

export const socketSlice = createSlice({
	name: 'socket',
	initialState: null,
	reducers: {
		socketConnect: (state, action) => {
			return action.payload
		},
		socketDisconnect: (state) => {
			return null
		}
	}
})

export const { socketConnect, socketDisconnect } = socketSlice.actions
export default socketSlice.reducer