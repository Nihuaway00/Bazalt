import MessageController from "#messages/messageController.js"
import ChatController from "#chats/chatController.js"
import MemberController from "#members/memberController.js"
import AttachmentController from "#attachment/attachmentController.js"
import { where, orderBy, limit } from "firebase/firestore"
import { AesCryptoHandler } from "#handlers/cryptoHandler.js"
import ErrorHandler from "#errorHandler"
import fileHandler from "#handlers/fileHandler.js"
import UserController from "#user/userController.js"
import chatAvatarController from "#chats/chatAvatar/chatAvatarController.js"
import ImageHandler from "#handlers/imageHandler.js"

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

	createPrivate = async (req, res) => {
		try {
			const { second_user_id } = req.body
			const { userID } = req.session

			if (!second_user_id || !userID) throw ErrorHandler.BadRequest("")
			const aes = new AesCryptoHandler()
			await aes.generateKey()
			const chatKeyJwk = await aes.exportKey()


			const privateChatSnap = await ChatController.add(
				null,
				true,
				null,
				chatKeyJwk
			)

			await MemberController.add(privateChatSnap.id, userID, null)
			await MemberController.add(privateChatSnap.id, second_user_id, null)

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
			if (chatSnap.data().creatorID !== userID) throw ErrorHandler.Forbidden("You`re not a creator of this chat")

			const messageSnaps = await MessageController.getFromChatID(chat_id)
			messageSnaps.map(async ({ id, data }) => {
				await MessageController.delete(id)
			})

			const avatarSnap = await chatAvatarController.getFromChatID(chat_id)
			if (avatarSnap?.exists()) {
				fileHandler.remove('chat.avatar', avatarSnap.id)
				await chatAvatarController.delete(avatarSnap.id)
			}

			const memberSnaps = await MemberController.getFromChatID(chat_id)
			memberSnaps.map(async ({ id }) => {
				await MemberController.delete(id)
			})

			await ChatController.delete(chat_id)

			this.io.to(chat_id).emit("SERVER:chat/remove")
			res.sendStatus(201)
		} catch (e) {
			console.log(e.message)
			res.status(e.status).send(e.message)
		}
	}

	invite = async (req, res) => {
		try {
			const { chat_id } = req.params
			const { invitedID } = req.body
			const { userID } = req.session

			if (!invitedID || !chat_id) throw ErrorHandler.BadRequest()
			const chatSnap = await ChatController.getFromID(chat_id)
			if (!chatSnap.exists()) throw ErrorHandler.NotFound()

			const memberSnap = await MemberController.getOne(userID, chat_id)
			if (!memberSnap) throw ErrorHandler.Forbidden('You aren`t member of this chat')
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

	kick = async (req, res) => {
		try {
			const { to_kick_id } = req.body
			const { userID } = req.session
			const { chat_id } = req.params

			if (!to_kick_id || !chat_id) throw ErrorHandler.BadRequest()
			const chatSnap = await ChatController.getFromID(chat_id)
			if (!chatSnap.exists()) throw ErrorHandler.NotFound("Chat with this ID in not found")
			const toKickMemberSnap = await MemberController.getOne(to_kick_id, chat_id)
			if (!toKickMemberSnap.exists()) throw ErrorHandler.NotFound("This member is not found")
			const memberSnap = await MemberController.getOne(userID, chat_id)
			if (!memberSnap?.exists()) throw ErrorHandler.NotFound("You are not member of this chat")
			if (toKickMemberSnap.data().invitedBy !== userID) throw ErrorHandler.Forbidden("You weren`t invite this member")

			const toKickUserSnap = await UserController.getFromID(to_kick_id)
			const systemMessageSnap = await MessageController.add(
				chat_id,
				null,
				`${toKickUserSnap.data().name} kicked from this chat`,
				true
			)

			await MemberController.delete(toKickMemberSnap.id)

			this.io
				.to(chat_id)
				.emit("SERVER:chat/member/kick", { message: systemMessageSnap.data() })
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
				const candidateSnaps = await MemberController.get([where('chatID', '==', chat_id), where('userID', '!=', userID), orderBy('invitedAt', 'desc')])
				if (candidateSnaps.length > 0) {
					await ChatController.update(chat_id, { creatorID: candidateSnaps[0].id })
				}
			}

			await MemberController.delete(memberSnap.id)
			const systemMessageSnap = await MessageController.add(
				chat_id,
				null,
				`${userID} left from this chat`,
				true
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

	editTitle = async (req, res) => {
		try {
			const { title } = req.body
			const { userID } = req.session
			const { chat_id } = req.params

			if (!title || !chat_id) throw ErrorHandler.BadRequest()
			const chatSnap = await ChatController.getFromID(chat_id)
			if (!chatSnap.exists()) throw ErrorHandler.NotFound()
			const memberSnap = await MemberController.getOne(userID, chat_id)
			if (!memberSnap.exists()) throw ErrorHandler.NotFound()
			const re = title.match(/[a-zA-Z0-9]*$/)
			if (!re) throw ErrorHandler.BadRequest("Title is have unsupported symbols")

			await ChatController.update(chat_id, { title })
			const userSnap = await UserController.getFromID(userID)
			const systemMessageSnap = await MessageController.add(
				chat_id,
				null,
				`${userSnap.data().name} changed title to: ${title}`,
				true
			)

			this.io
				.to(chat_id)
				.emit("SERVER:chat/edit/title", { message: systemMessageSnap.data() })
			res.sendStatus(201)
		} catch (e) {
			console.log(e.message)
			res.status(500).send(e.message)
		}
	}

	editAvatar = async (req, res) => {
		try {
			const avatar = req.file
			const { chat_id } = req.params
			const { userID } = req.session

			if (!avatar || !chat_id) throw ErrorHandler.BadRequest()
			const chatSnap = await ChatController.getFromID(chat_id)
			if (!chatSnap.exists()) throw ErrorHandler.Forbidden("Chat is undefined")
			const memberSnap = await MemberController.getOne(userID, chat_id)
			if (!memberSnap.exists()) throw ErrorHandler.Forbidden("You`re not member of this chat")

			if (!["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(avatar.mimetype))
				throw ErrorHandler.BadRequest("The files contain an unsupported format")
			if (avatar.size > 1048576)
				throw ErrorHandler.BadRequest("There is a huge file in files: " + file.size.toString())

			const metadata = await ImageHandler.getMetadata(avatar.buffer)
			if (Math.min(metadata.width, metadata.height) < 100)
				throw ErrorHandler.BadRequest("Avatar has resolution less than 100px")
			if (Math.max(metadata.width, metadata.height) > 2000)
				throw ErrorHandler.BadRequest("Avatar has too large resolution more then 2000px")

			const avatarSnap = await chatAvatarController.getFromChatID(chat_id)
			if (avatarSnap?.exists()) {
				await chatAvatarController.delete(avatarSnap.id)
			}

			const newAvatarRef = await chatAvatarController.createRef()
			fileHandler.uploadBuffer('chat.avatar', newAvatarRef.id, avatar.mimetype, avatar.buffer)
			const path = `chat.avatar/${newAvatarRef.id}.${avatar.mimetype.split("/")[1]}`
			await chatAvatarController.set(newAvatarRef, chat_id, path)

			this.io.to(chat_id).emit("SERVER: chat/edit/avatar", { path })
			res.send(201)
		} catch (e) {
			console.log(e.message)
			res.status(500).send(e.message)
		}
	}
}

export default ChatService
