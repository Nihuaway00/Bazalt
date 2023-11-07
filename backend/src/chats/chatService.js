import MessageController from "#messages/messageController.js"
import ChatController from "#chats/chatController.js"
import MemberController from "#members/memberController.js"
import AttachmentController from "#attachment/attachmentController.js"
import { where, orderBy, limit } from "firebase/firestore"
import { AesCryptoHandler } from "#handlers/cryptoHandler.js"
import ErrorHandler from "#errorHandler"
import fileHandler from "#handlers/fileHandler.js"
import UserController from "#user/userController.js"

class ChatService {
	io
	socket

	constructor(io) {
		this.io = io
		this.io.on("connection", socket => (this.socket = socket))
	}

	get = async (req, res, next) => {
		try {
			const { chat_id } = req.params
			const { userID } = req.session

			if (!chat_id) throw ErrorHandler.BadRequest("Chat id is undefined")
			const chatSnap = await ChatController.getFromID(chat_id)
			if (!chatSnap.exists()) throw ErrorHandler.NotFound("Chat is undefined")
			const memberSnap = await MemberController.getOne(userID, chat_id)
			if (!memberSnap.exists())
				throw ErrorHandler.Forbidden("You`re not member of this chat")

			const { lastSeen } = memberSnap.data()
			const messageSnaps = await MessageController.get([
				where("chatID", "==", chat_id),
				where("sentAt", ">", lastSeen)
			])

			const lastMessageSnaps = await MessageController.get([
				where("chatID", "==", chat_id),
				orderBy("sentAt", "desc"),
				limit(1)
			])

			let attacmentSnaps = []
			let lastMessage = {}
			if (lastMessageSnaps.length !== 0) {
				const id = lastMessageSnaps[0].id
				const data = lastMessageSnaps[0].data()

				attacmentSnaps = await AttachmentController.getFromMessageID(id)
				lastMessage = {
					message: data,
					attachments: attacmentSnaps.map(snap => snap.data())
				}
			}

			const toEncrypt = {
				chat: chatSnap.data(),
				unreadCount: messageSnaps.length,
				lastMessage
			}

			req.body = { toEncrypt: JSON.stringify(toEncrypt) }
			next()
		} catch (e) {
			console.log(e.message)
			res.status(e.status).send(e.message)
		}
	}

	getMessages = async (req, res, next) => {
		try {
			const { chat_id } = req.params
			const { timestamp, newest } = req.body
			const { userID } = req.session

			console.log(newest);

			if (!chat_id || !timestamp)
				throw ErrorHandler.BadRequest("Invalid input data")
			const chatSnap = await ChatController.getFromID(chat_id)
			if (!chatSnap.exists())
				throw ErrorHandler.NotFound("Chat with this ID in not found")
			const memberSnap = await MemberController.getOne(userID, chat_id)
			if (!memberSnap.exists())
				throw ErrorHandler.Forbidden("You`re not member of this chat")

			let messageSnaps = []
			if (newest) {
				messageSnaps = await MessageController.get([
					where('chatID', '==', chat_id),
					where("sentAt", ">", new Date(timestamp)),
					orderBy('sentAt', 'desc'),
					limit(10)
				])
			} else {
				messageSnaps = await MessageController.get([
					where('chatID', '==', chat_id),
					where("sentAt", "<=", new Date(timestamp)),
					orderBy('sentAt', 'desc'),
					limit(10)
				])
			}

			const toEncrypt = {
				messages: messageSnaps.map(async snap => {
					const attachmentSnaps = await AttachmentController.getFromMessageID(
						snap.id
					)
					return {
						message: snap.data(),
						attachments: attachmentSnaps.map(attach => attach.data())
					}
				})
			}

			Promise.all(toEncrypt.messages).then(messages => {
				req.body = { toEncrypt: JSON.stringify({ messages }) }
				next()
			})
		} catch (e) {
			console.log(e.message)
			res.status(e.status).send(e.message)
		}
	}

	// getChatIDs = async (req, res) => {
	//   try {
	//     const { userID } = req.session
	//     if (!userID) throw ErrorHandler.BadRequest("User ID in undefined")
	//     const userSnap = await UserController.getFromID(userID)
	//     if (!userSnap.exists())
	//       throw ErrorHandler.NotFound("User with this ID is not found")
	//     const memberSnaps = await MemberController.getFromUserID(userID)

	//     res.send({ chats: memberSnaps.map(snap => snap.data().chatID) })
	//   } catch (e) {
	//     console.log(e.message)
	//     res.status(500).send(e.message)
	//   }
	// }

	create = async (req, res) => {
		try {
			const { title } = req.body
			const { userID } = req.session

			if (!title || !userID) throw ErrorHandler.BadRequest("no title or userID")
			const aes = new AesCryptoHandler()
			await aes.generateKey()
			const chatKeyJwk = await aes.exportKey()


			const chatSnap = await ChatController.add(
				title,
				false,
				userID,
				chatKeyJwk
			)
			await MemberController.add(chatSnap.id, userID, userID)
			if (this.socket) {
				this.socket.emit("SERVER:chat", chatSnap.data())

			}
			res.sendStatus(201)
		} catch (e) {
			console.log(e.message)
			res.status(e.status).send(e.message)
		}
	}

	remove = async (req, res) => {
		try {
			const { chat_id } = req.params
			const { userID } = req.session

			if (!chat_id) throw ErrorHandler.BadRequest()
			const chatSnap = await ChatController.getFromID(chat_id)
			if (!chatSnap.exists()) throw ErrorHandler.NotFound()
			if (chatSnap.data().creatorID !== userID) throw ErrorHandler.Forbidden()

			const messageSnaps = await MessageController.getFromChatID(chat_id)
			const attachmentsToRemove = messageSnaps.map(async ({ id, data }) => {
				await MessageController.delete(id)
				if (!data().hasAttachemnts) return
				const attachmentSnaps = await AttachmentController.getFromMessageID(id)
				return attachmentSnaps.map(async ({ data, id }) => {
					await AttachmentController.delete(id)
					return data().path.split("/", 2)[1]
				})
			})

			Promise.all(attachmentsToRemove).then(res => {
				fileHandler.removeMany("attachments", res.flat())
			})

			const memberSnaps = await MemberController.getFromChatID(chat_id)
			memberSnaps.map(async ({ id }) => {
				await MemberController.delete(id)
			})

			await ChatController.delete(chat_id)

			this.io.to(chat_id).emit("SERVER:chat/remove")
		} catch (e) {
			console.log(e.message)
			res.status(e.status).send(e.message)
		}
	}

	// editTitle = async (req, res) => {
	//   try {
	//   } catch (e) {
	//     console.log(e.message)
	//     res.status(500).send(e.message)
	//   }
	// }

	// addAvatar = async (req, res) => {
	//   try {
	//   } catch (e) {
	//     console.log(e.message)
	//     res.status(500).send(e.message)
	//   }
	// }

	// removeAvatar = async (req, res) => {
	//   try {
	//   } catch (e) {
	//     console.log(e.message)
	//     res.status(500).send(e.message)
	//   }
	// }

	invite = async (req, res) => {
		try {
			const { chat_id } = req.params
			const { invitedID } = req.body
			const { userID } = req.session

			if (!invitedID || !chat_id) throw ErrorHandler.BadRequest()
			const chatSnap = await ChatController.getFromID(chat_id)
			if (!chatSnap.exists()) throw ErrorHandler.NotFound()

			const memberSnap = await MemberController.getOne(userID, chat_id)
			if (!memberSnap) throw ErrorHandler.Forbidden()
			const invitedUserSnap = await UserController.getFromID(invitedID)

			if (!invitedUserSnap.exists())
				throw ErrorHandler.BadRequest("Invated user already in chat")

			const invitedMemberSnap = await MemberController.getOne(
				invitedID,
				chat_id
			)
			if (invitedMemberSnap)
				throw ErrorHandler.BadRequest("Invated user already in chat")

			await MemberController.add(chat_id, invitedID, userID)
			const systemMessageSnap = await MessageController.add(
				chat_id,
				null,
				`${invitedUserSnap.data().name} added to this chat`,
				true,
				false
			)

			this.io
				.to(chat_id)
				.emit("SERVER:chat/member", { message: systemMessageSnap.data() })
			res.sendStatus(201)
		} catch (e) {
			console.log(e.message)
			res.status(e.status).send(e.message)
		}
	}

	leave = async (req, res) => {
		try {
			const { chat_id } = req.params
			const { userID } = req.session

			if (!chat_id) throw ErrorHandler.BadRequest()
			const chatSnap = await ChatController.getFromID(chat_id)
			if (!chatSnap.exists()) throw ErrorHandler.NotFound()


			const memberSnap = await MemberController.getOne(userID, chat_id)
			if (!memberSnap.exists()) throw ErrorHandler.NotFound()

			if (memberSnap.data().userID === chatSnap.data().creatorID) {
				//перенос создателя на другого участника
			}

			await MemberController.delete(memberSnap.id)
			const systemMessageSnap = await MessageController.add(
				chat_id,
				null,
				`${userID} left from this chat`,
				true,
				false
			)

			if (this.io) {
				this.io
					.to(chat_id)
					.emit("SERVER:chat/member/leave", { message: systemMessageSnap.data() })
			}


			res.sendStatus(201)
		} catch (e) {
			console.log(e.message)
			res.status(e.status).send(e.message)
		}
	}

	// removeMember = async (req, res) => {
	//   try {
	//     const { userID, chatID } = req.body
	//     if (!userID || !chatID) throw new Error("Invalid input data")

	//     const userSnap = await UserController.getFromID(userID)
	//     if (!userSnap.exists()) throw new Error("User in not exist")

	//     const chatSnap = await ChatController.getFromID(chatID)
	//     if (!chatSnap.exists()) throw new Error("Chat in not exist")
	//     if (chatSnap.data().isPrivate) throw new Error("Chat is private")

	//     const memberSnap = await MemberController.getOne(userID, chatID)
	//     if (!memberSnap.exists())
	//       throw new Error("User isn`t member of this chat")

	//     await MemberController.delete(memberSnap.id)
	//     // const MessageAppSnap = await MessageAppController.add(
	//     //   chatID,
	//     //   "member/delete"
	//     // );

	//     this.io.to(chatID).emit("SERVER:chat/deleteMember", {
	//       userID,
	//       time: MessageAppSnap.data().time,
	//       type: MessageAppSnap.data().type
	//     })
	//     res.sendStatus(200)
	//   } catch (e) {
	//     console.log(e.message)
	//     res.status(500).send(e.message)
	//   }
	// }

	// upgradeMember = async (req, res) => {
	//   try {
	//   } catch (e) {
	//     console.log(e.message)
	//     res.status(500).send(e.message)
	//   }
	// }

	// downgradeMember = async (req, res) => {
	//   try {
	//   } catch (e) {
	//     console.log(e.message)
	//     res.status(500).send(e.message)
	//   }
	// }
}

export default ChatService
