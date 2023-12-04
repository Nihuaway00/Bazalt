import {$api} from "@/axios/axiosConfig";
import {IDataFetcher} from "@/routes/IDataFetcher";

export class DataFetcher implements IDataFetcher{
    async get(url: string) {
        return $api.get(url);
    }
    async post(url: string, data: object) {
        return $api.post(url, data);
    }
}