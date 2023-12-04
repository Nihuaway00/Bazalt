export interface ISign{
    sign(data: ArrayBuffer): Promise<ArrayBuffer>
    verify(signature: ArrayBuffer, data: ArrayBuffer): Promise<boolean>
}