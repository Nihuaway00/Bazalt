import {useMutation} from "react-query";
import {AuthRoute} from "@/routes/auth/AuthRoute";

export interface IRegistrationProps{
    username: string;
    email: string;
    pass: string;
}
export function useRegistration(){
    return useMutation('registration', async ({username, email, pass}: IRegistrationProps) => AuthRoute.registration(username, email, pass))
}