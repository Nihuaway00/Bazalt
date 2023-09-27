import MemberController from "../controllers/memberController"

class MemberService {
	create = async (chatID, isPrivate, memberIDs) => {
		if (!isPrivate) {
			memberIDs.map(async (memberID) => {
				await MemberController.add(chatID, memberID)
			})
		} else {
			await MemberController.add(chatID, memberIDs[0])
		}
	}
}

export default new MemberService()
