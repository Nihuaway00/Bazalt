import {$api} from "@/axios/axiosConfig";

export class HttpClient{
    static async get(url: string) {
        return $api.get(url);
    }
    static async post(url: string, data: object) {
        return $api.post(url, data);
    }
}