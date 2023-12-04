export interface IKey<T>{
    exportKey(format: string): T;
    importKey(format: string, keyData: []): void;
}