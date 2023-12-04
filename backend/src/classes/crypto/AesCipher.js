import crypto from "node:crypto"

export class AesCryptoHandler {
    key

    constructor() {}

    generateKeyFromData = async (keyData, salt) => {
        const baseKey = await crypto.subtle.importKey(
            "raw",
            Buffer.from(keyData),
            "PBKDF2",
            false,
            ["deriveKey"]
        )

        this.key = await crypto.subtle.deriveKey(
            {
                name: "PBKDF2",
                hash: "SHA-256",
                iterations: 10,
                salt: Buffer.from(salt),
            },
            baseKey,
            {
                name: "AES-GCM",
                length: 256,
            },
            true,
            ["encrypt", "decrypt"]
        )
    }

    generateKey = async () => {
        this.key = await crypto.subtle.generateKey(
            {
                name: "AES-GCM",
                length: 256,
            },
            true,
            ["encrypt", "decrypt"]
        )
    }

    encrypt = async (data, iv = crypto.getRandomValues(new Uint8Array(16))) => {
        const en = new TextEncoder()
        const encrypted = await crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv,
            },
            this.key,
            en.encode(data)
        )
        return {
            encrypted,
            iv,
        }
    }

    decrypt = async (signature, iv) => {
        const dec = new TextDecoder()
        const decrypted = await crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv,
            },
            this.key,
            signature
        )
        return dec.decode(decrypted)
    }

    exportKey = async (format = "jwk") => {
        return await crypto.subtle.exportKey(format, this.key)
    }

    importKey = async (format, keyData) => {
        this.key = await crypto.subtle.importKey(
            format,
            keyData,
            {
                name: "AES-GCM",
                length: 256,
            },
            true,
            ["encrypt", "decrypt"]
        )
    }
}
