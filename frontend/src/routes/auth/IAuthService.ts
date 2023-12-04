import {AxiosResponse} from "axios";
import {HttpClient} from "@/routes/HttpClient";

export interface IAuthService{
    client: HttpClient
    login(email:string, pass:string): Promise<AxiosResponse>
    registration(username: string, email:string, pass:string): Promise<AxiosResponse>
    logout(): Promise<AxiosResponse>
}