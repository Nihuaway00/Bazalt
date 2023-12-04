import {ISign} from "@/classes/crypto/ISign";
import {IKey} from "@/classes/crypto/IKey";
const crypto = globalThis.crypto

export class HmacSigner implements ISign, IKey<CryptoKey>{
    // @ts-ignore
    key: CryptoKey;

    async exportKey(): Promise<JsonWebKey> {
        return await crypto.subtle.exportKey('jwk', this.key)
    }

    async generateKey() {
        this.key = await crypto.subtle.generateKey({
            name: "HMAC",
            hash: "SHA-256",
        }, true, ["sign", "verify"])
    }

    async importKey(keyData: JsonWebKey) {
        this.key = await crypto.subtle.importKey(
            'jwk',
            keyData,
            {
                name: "HMAC",
                hash: "SHA-256",
            },
            true,
            ["sign", "verify"]
        )
    }

    async sign(data: ArrayBuffer) {
        return await crypto.subtle.sign(
            {
                name: "HMAC",
                hash: "SHA-256",
            },
            this.key,
            data
        )
    }

    async verify(signature: ArrayBuffer, data: ArrayBuffer): Promise<boolean> {
        return await crypto.subtle.verify(
            {
                name: "HMAC",
                hash: "SHA-256",
            },
            this.key,
            signature,
            data
        )
    }

}