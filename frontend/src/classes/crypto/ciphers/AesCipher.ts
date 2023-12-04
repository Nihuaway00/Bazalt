import {ICipher} from "@/classes/crypto/IChipher";
import {IKey} from "@/classes/crypto/IKey";
const crypto = globalThis.crypto

export class AesCipher implements ICipher, IKey<CryptoKey>{

    // @ts-ignore
    key: CryptoKey;
    // @ts-ignore
    private _iv: ArrayBuffer;

    get iv(): ArrayBuffer {
        return this._iv;
    }

    set iv(value: ArrayBuffer) {
        this._iv = value;
    }

    constructor() {
        this._iv = crypto.getRandomValues(new Uint8Array(16))
    }

    async decrypt(signature: Uint8Array, iv: Uint8Array) {
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

    async encrypt(data: Uint8Array) {
        return await crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv: this.iv,
            },
            this.key,
            data
        )
    }

    async exportKey(){
        return await crypto.subtle.exportKey('jwk', this.key)
    }

    async generateKey() {
        this.key = await crypto.subtle.generateKey(
            {
                name: "AES-GCM",
                length: 256,
            },
            true,
            ["encrypt", "decrypt"]
        )
    }

    async importKey(keyData: JsonWebKey) {
        this.key = await crypto.subtle.importKey(
            'jwk',
            keyData,
            {
                name: "AES-GCM",
                length: 256,
            },
            true,
            ["encrypt", "decrypt"]
        )
    }

    async generateKeyFromData(keyData: ArrayBuffer, salt: ArrayBuffer) {
        const baseKey = await crypto.subtle.importKey(
            "raw",
            keyData,
            "PBKDF2",
            false,
            ["deriveKey"]
        )

        this.key = await crypto.subtle.deriveKey(
            {
                name: "PBKDF2",
                hash: "SHA-256",
                iterations: 10,
                salt,
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
    
}