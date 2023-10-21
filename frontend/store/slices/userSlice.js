import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
	name: 'user',
	initialState: { unauthorized: true },
	reducers: {
		setUser: (state, action) => {
			return { ...action.payload, unauthorized: false }
		},
		unauthorized: (state) => {
			return { unauthorized: true }
		}
	}
})

export const { setUser, unauthorized } = userSlice.actions
export default userSlice.reducer