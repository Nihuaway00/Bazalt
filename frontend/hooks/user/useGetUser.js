import { useQuery } from "react-query"
import UserRoute from "../../routes/userRoute"

export const useGetUser = (userID) => {
	return useQuery(['user', userID], async () => await UserRoute.get(userID), { enabled: !!userID, select: ({ data }) => data })
}