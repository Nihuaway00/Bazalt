import MessageController from "#messages/messageController.js"
import MemberController from "#members/memberController.js"
import { AesCryptoHandler } from "#crypto/AesCipher.js"
import chatController from "#chats/chatController.js"
import ErrorHandler from "#errorHandler"

export class MessageService {
    io
    socket

    constructor(io) {
        this.io = io
        io.on("connection", socket => (this.socket = socket))
    }

    get = async (req, res, next) => {
        try {
            const { message_id } = req.params
            const { userID } = req.session

            if (!message_id) throw ErrorHandler.BadRequest()
            const messageSnap = await MessageController.getFromID(message_id)
            if (!messageSnap.exists()) throw ErrorHandler.NotFound()

            const memberSnap = await MemberController.getOne(
                userID,
                messageSnap.data().chatID
            )
            if (!memberSnap?.exists())
                throw ErrorHandler.Forbidden("You`re not member of this chat")

            const toEncrypt = JSON.stringify({
                message: memberSnap.data(),
            })

            req.body = { toEncrypt }
            next()
        } catch (e) {
            console.log(e.message)
            res.status(e.status).send(e.message)
        }
    }

    send = async (req, res) => {
        try {
            const { userID } = req.session
            const { value, chatID } = req.body

            if (!value || !chatID) throw ErrorHandler.BadRequest()
            const chatSnap = await chatController.getFromID(chatID)
            if (!chatSnap.exists()) throw ErrorHandler.NotFound()
            const memberSnap = await MemberController.getOne(userID, chatID)
            if (!memberSnap.exists())
                throw ErrorHandler.Forbidden("You`re not member of this chat")

            const messageSnap = await MessageController.add(
                chatID,
                userID,
                value,
                false
            )
            const chatKeyJwk = chatSnap.data().key

            const aes = new AesCryptoHandler()
            await aes.importKey("jwk", chatKeyJwk)
            const { encrypted, iv } = await aes.encrypt(
                JSON.stringify({
                    message: messageSnap.data(),
                })
            )

            this.io.to(chatID).emit("SERVER:message", {
                chatID,
                encrypted: new Uint8Array(encrypted).toString(),
                iv: iv.toString(),
            })
            res.sendStatus(201)
        } catch (e) {
            console.log(e.message)
            res.status(e.status).send(e.message)
        }
    }

    remove = async (req, res) => {
        try {
            const { message_id } = req.params
            const { userID } = req.session

            if (!message_id) throw ErrorHandler.BadRequest()
            const messageSnap = await MessageController.getFromID(message_id)
            if (!messageSnap.exists()) throw ErrorHandler.NotFound()
            if (messageSnap.data().system)
                throw ErrorHandler.Forbidden(
                    "Message is system. You cannot delete it"
                )
            if (userID !== messageSnap.data().userID)
                throw ErrorHandler.Forbidden("You`re not message owner")

            await MessageController.delete(message_id)

            this.socket
                .to(messageSnap.data().chatID)
                .emit("SERVER:message/remove", { messageID: message_id })
            res.sendStatus(201)
        } catch (e) {
            console.log(e.message)
            res.status(500).send(e.message)
        }
    }

    edit = async (req, res) => {
        try {
            const { value } = req.body
            const { userID } = req.session
            const { message_id } = req.params
            if (!value || !message_id) throw ErrorHandler.BadRequest()
            const messageSnap = await MessageController.getFromID(message_id)
            if (!messageSnap.exists()) throw ErrorHandler.NotFound()
            if (messageSnap.data().system)
                throw ErrorHandler.Forbidden("This message is system")
            if (messageSnap.data().userID !== userID)
                throw ErrorHandler.Forbidden("This is not your message")
            const updatedMessageSnap = await MessageController.update(
                message_id,
                {
                    value,
                    editedAt: new Date().valueOf(),
                }
            )

            const chatSnap = await chatController.getFromID(
                messageSnap.data().chatID
            )
            const chatKeyJwk = chatSnap.data().key

            const aes = new AesCryptoHandler()
            await aes.importKey("jwk", chatKeyJwk)
            const { encrypted, iv } = await aes.encrypt(
                JSON.stringify(updatedMessageSnap.data())
            )

            this.io.to(chatSnap.id).emit("SERVER:message", {
                chatID: chatSnap.id,
                encrypted: new Uint8Array(encrypted).toString(),
                iv: iv.toString(),
            })
            res.sendStatus(201)
        } catch (e) {
            console.log(e.message)
            res.status(e.status).send(e.message)
        }
    }
}
