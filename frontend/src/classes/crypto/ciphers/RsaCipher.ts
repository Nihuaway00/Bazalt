import {ICipher} from "@/classes/crypto/IChipher";
import {IKey} from "@/classes/crypto/IKey";
import {webcrypto} from "crypto";

export class RsaCipher implements ICipher, IKey<{publicKey: CryptoKey, privateKey: CryptoKey}>{
    // @ts-ignore
    key: { publicKey: CryptoKey; privateKey: CryptoKey };

    async decrypt(signature: Uint8Array, iv: Uint8Array): Promise<string> {
        const decrypted = await crypto.subtle.decrypt(
            {
                name: "RSA-OAEP",
            },
            this.key.privateKey,
            signature
        )
        const decoder = new TextDecoder();
        return decoder.decode(decrypted);
    }

    async encrypt(data: Uint8Array): Promise<ArrayBuffer> {
        return await crypto.subtle.encrypt(
            {
                name: "RSA-OAEP",
            },
            this.key.publicKey,
            data
        )
    }

    async exportKey(): Promise<JsonWebKey> {
       return await crypto.subtle.exportKey(
            'jwk',
            this.key.privateKey
        )
        // const publicKey = await crypto.subtle.exportKey(
        //     'jwk',
        //     this.key.publicKey
        // )
    }

    async generateKey() {
        const algo = {
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256",
        }

        this.key = await crypto.subtle.generateKey(
            algo,
            true,
            ["decrypt", "encrypt"]
        )
    }

    async importKey(keyData: JsonWebKey) {
        this.key.privateKey = await crypto.subtle.importKey(
            'jwk',
            keyData,
            { name: "RSA-OAEP", hash: "SHA-256" },
            true,
            ["decrypt"]
        )
    }

}