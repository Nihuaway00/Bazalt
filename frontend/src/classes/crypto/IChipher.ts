export interface ICipher {
    encrypt(data: Uint8Array): Promise<ArrayBuffer>;
    decrypt(signature: Uint8Array, iv: Uint8Array): Promise<string>;
}

