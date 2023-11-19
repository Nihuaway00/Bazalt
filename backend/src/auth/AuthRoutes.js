import { isAuthorized } from "#middlewares/authorizeMiddleware.js"
import { AuthService } from "#auth/authService.js"

export const AuthRoutes = (app) => {
	app.post("/auth/registration", AuthService.registration)
	app.get("/auth/activate/:activate_token", AuthService.activate)
	app.post("/auth/login", AuthService.login)
	app.get("/auth/refresh", isAuthorized, AuthService.refresh)
	app.get("/auth/logout", isAuthorized, AuthService.logout)
	app.post("/auth/restore", AuthService.sendRestoreToken)
	app.post("/auth/restore/:restore_token", AuthService.restoreAccess)
}