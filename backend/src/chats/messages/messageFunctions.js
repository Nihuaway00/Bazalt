import crypto, { subtle } from "crypto"
class MessageFunctions {
    encrypt = async (key, data) => {
        const ec = new TextEncoder()
        const iv = crypto.getRandomValues(new Uint8Array(16))
        const ciphertext = await subtle.encrypt(
            {
                name: "AES-CBC",
                iv,
            },
            key,
            ec.encode(data)
        )

        return {
            key,
            ciphertext,
            iv,
        }
    }

    decrypt = async (ciphertext, key, iv) => {
        const dec = new TextDecoder()
        const plaintext = await crypto.subtle.decrypt(
            {
                name: "AES-CBC",
                iv,
            },
            key,
            ciphertext
        )

        return dec.decode(plaintext)
    }
}

export default new MessageFunctions()
