import Authorized from "../middlewares/authorizedMiddleware"

export const Middlewares = ({ children }) => {
	return (
		<Authorized>
			{children}
		</Authorized>
	)
}

