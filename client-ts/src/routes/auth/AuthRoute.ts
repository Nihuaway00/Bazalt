import {HttpClient} from "@/routes/HttpClient";
import {EAuthRoutes} from "@/routes/auth/EAuthRoutes";
import {IAuthService} from "@/routes/auth/IAuthService";

export class AuthService{

    static async login(email: string, pass: string){
        return HttpClient.post(EAuthRoutes.login, {email, pass});
    }

    static async registration(username: string, email: string, pass: string){
        return HttpClient.post(EAuthRoutes.registration, {username, email, pass});
    }

    static async logout(){
        return HttpClient.get(EAuthRoutes.logout);
    }
}