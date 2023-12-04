import ErrorHandler from "#errorHandler"
import { AesCryptoHandler } from "#crypto/AesCipher.js"

export const encryptData = async (req, res, next) => {
    try {
        const { toEncrypt } = req.body //only string
        const { key } = req.session

        const aes = new AesCryptoHandler()
        await aes.generateKeyFromData(key.toString(), "salt")

        const { iv, encrypted } = await aes.encrypt(toEncrypt)

        res.send({
            encrypted: new Uint8Array(encrypted).toString(),
            iv: iv.toString(),
        })
    } catch (e) {
        next(e)
    }
}

export const decryptData = async (req, res, next) => {
    try {
        const { encrypted, iv } = req.body
        const { key } = req.session

        if (!encrypted || !iv)
            throw ErrorHandler.BadRequest(
                "You weren`t send encrypted data and iv"
            )

        const aes = new AesCryptoHandler()
        await aes.generateKeyFromData(key.toString(), "salt")
        const decrypted = await aes.decrypt(
            new Uint8Array(encrypted.split(",")),
            new Uint8Array(iv.split(","))
        )
        req.body = { ...JSON.parse(decrypted), iv }
        next()
    } catch (e) {
        next(e)
    }
}
