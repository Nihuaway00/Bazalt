import { useMutation, useQuery } from "react-query"
import UserRoute from "../../routes/userRoute"

export const useGetChats = (unauthorized) => {
	return useQuery(['chats'], UserRoute.getChats, {
		enabled: !unauthorized,
		select: ({ data }) => data
	})
}