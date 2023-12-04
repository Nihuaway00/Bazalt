import {AxiosResponse} from "axios";

export interface IDataFetcher{
    get(url: string): Promise<AxiosResponse>
    post(url: string, data: object): Promise<AxiosResponse>
}