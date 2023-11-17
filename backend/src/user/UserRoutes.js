// import multer from "multer";
// const uploadImage = multer({ storage: multer.memoryStorage() });
import SessionMiddleware from "#middlewares/authorizeMiddleware.js"
import UserService from "#user/userService.js"

const UserRoutes = (app) => {
	// app.post("/user/avatar/get", avatarService.get);
	// app.post(
	//   "/user/avatar/add",
	//   uploadImage.single("avatar"),
	//   // avatarMiddleware,
	//   avatarService.add
	// );
	// app.post("/user/avatar/delete", avatarService.delete);
	app.get("/user/:userID", SessionMiddleware.authorized, UserService.get)
	app.get("/users/chats", SessionMiddleware.authorized, UserService.getChats)
	app.get("/user/tag/:tag", SessionMiddleware.authorized, UserService.find)
}

export default UserRoutes
