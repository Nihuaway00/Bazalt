import SessionMiddleware from "#middlewares/sessionMiddleware.js"
import AuthService from "#auth/authService.js"

const AuthRoutes = (app) => {
	app.post("/auth/registration", AuthService.registration)
	app.get("/auth/activate/:activate_token", AuthService.activate)
	app.post("/auth/login", AuthService.login)
	app.post("/auth/verify", AuthService.verify)
	app.get("/auth/logout", SessionMiddleware.authorized, AuthService.logout)
	app.post("/auth/restore", AuthService.sendRestoreToken)
	app.post("/auth/restore/:restore_token", AuthService.restoreAccess)
}

export default AuthRoutes
