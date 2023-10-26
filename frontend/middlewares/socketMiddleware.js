import { useDispatch, useSelector } from "react-redux"
import { useRefresh } from "../hooks/auth/useRefresh"
import { useEffect } from "react"
import { setUser } from "../store/slices/userSlice"
import { socketConnect } from "../store/slices/socketSlice"
import { io } from "socket.io-client"

export const SocketMiddleware = ({ children }) => {
	const dispatch = useDispatch()
	const s = useSelector(state => state.socket)

	// useEffect(() => {
	// 	const sessionID = localStorage.getItem("sessionID")
	// 	if (!sessionID || s) return
	// 	console.log(s);
	// 	const socket = io("http://localhost:8000", {
	// 		extraHeaders: { sessionID }
	// 	})
	// 	dispatch(socketConnect(socket))
	// }, [])

	return children
}