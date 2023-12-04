export interface IKey<KeyType>{
    key: KeyType;
    generateKey(): void;
    exportKey(): Promise<JsonWebKey>;
    importKey(keyData: JsonWebKey): void;
}