// import multer from "multer";
// const uploadImage = multer({ storage: multer.memoryStorage() });
import SessionMiddleware from "#middlewares/sessionMiddleware.js"
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
	app.get("user/chats", SessionMiddleware.authorized, UserService.getChats)
}

export default UserRoutes
