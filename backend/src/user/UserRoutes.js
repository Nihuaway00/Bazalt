import multer from "multer";
const uploadAvatar = multer({ storage: multer.memoryStorage() });
import { isAuthorized } from "#middlewares/authorizeMiddleware.js"
import { UserService } from "#user/userService.js"

export const UserRoutes = (app) => {
	// изменение имени
	app.post("/user/edit/name", isAuthorized, UserService.editName)

	// изменение аватарки
	app.post("/user/edit/avatar", isAuthorized, uploadAvatar.single("avatar"), UserService.editAvatar)

	// изменение тега
	app.post("/user/edit/tag", isAuthorized, UserService.editTag)

	// получение всех чатов пользователя
	app.get("/users/chats", isAuthorized, UserService.getChats)

	// получение по тегу
	app.get("/user/tag/:tag", isAuthorized, UserService.getByTag)
}
