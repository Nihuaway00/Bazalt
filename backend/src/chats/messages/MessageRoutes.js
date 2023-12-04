import { isAuthorized } from "#middlewares/authorizeMiddleware.js"
import { MessageService } from "#messages/messageService.js"
import { encryptData, decryptData } from "#middlewares/cryptoMiddleware.js"

export const MessageRoutes = (app, io) => {
    const Message = new MessageService(io)
    // получение сообщения
    app.get("/message/:message_id", isAuthorized, Message.get, encryptData)

    // отправка сообщения
    app.post("/message", isAuthorized, decryptData, Message.send)

    // удаление сообщения
    app.get("/message/:message_id/remove", isAuthorized, Message.remove)

    // изменение сообщения
    app.post(
        "/message/:message_id/edit",
        isAuthorized,
        decryptData,
        Message.edit
    )
}
