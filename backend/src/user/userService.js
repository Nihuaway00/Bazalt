import MemberController from "#members/memberController.js"

class UserService {
	//get = async (req, res) => {
	//	try {
	//		const { userID } = req.body
	//		if (!userID) throw new Error("Invalid input data")
	//		const userSnap = await UserController.getFromID(userID)
	//		res.send(userSnap.data())
	//	} catch (e) {
	//		console.log(e.message)
	//		res.status(500).send(e.message)
	//	}
	//}

	// edit = async (req, res) => {
	//   try {
	//     const {name, email} = req.body;
	//     const {userID} = req.session
	//     if (!name || !email || !userID) throw new Error('Invalid input data');

	//     await UserController.update(userID, {name, email});
	//     res.sendStatus(200);
	//   } catch (e) {
	//     console.log(e.message);
	//     res.status(500).send(e.message);
	//   }
	// }

	// editPassword = async (req, res) => {
	//   try {
	//     const { password } = req.body
	//     const { userID } = req.session
	//     const sessionID = req.session.id
	//     if (!password || !userID) throw new Error("Invalid input data")

	//     const hashedPassword = bcrypt.hashSync(password, 3)
	//     const { id } = await PasswordController.getFromUserID(userID)
	//     await PasswordController.update(id, { value: hashedPassword })

	//     await SessionFunction.deleteFromUserID(userID, sessionID)
	//     res.sendStatus(200)
	//   } catch (e) {
	//     console.log(e.message)
	//     res.status(500).send(e.message)
	//   }
	// }

	// delete = async (req, res) => {
	//   try {
	//     const {userID} = req.session;
	//     await UserController.delete(userID);
	//     await SessionFunction.deleteFromUserID(userID);
	//   } catch (e) {
	//     console.log(e.message);
	//     res.status(500).send(e.message);
	//   }
	// }

	getChats = async (req, res) => {
		try {
			const { userID } = req.session

			const memberSnaps = await MemberController.getFromUserID(userID)
			res.send({ chatIDs: memberSnaps.map(({ data }) => data().chatID) })
		} catch (e) {
			console.log(e.message)
			res.status(e.status).send(e.message)
		}
	}
}

export default new UserService()
