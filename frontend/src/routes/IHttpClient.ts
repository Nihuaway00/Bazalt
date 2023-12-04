import {AxiosResponse} from "axios";

export interface IHttpClient {
    get(url: string): Promise<AxiosResponse>
    post(url: string, data: object): Promise<AxiosResponse>
}