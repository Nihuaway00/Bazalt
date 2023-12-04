export interface ICipher {
    encrypt(data: []): Promise<ArrayBuffer>;
    decrypt(encrypted: []): Promise<ArrayBuffer>;
    generateKey(): void;
}

export interface IKey<T>{
    exportKey(format: string): T;
    importKey(format: string, keyData: []): void;
}