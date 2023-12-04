import {useMutation} from "react-query";
import {AuthRoute} from "@/routes/auth/AuthRoute";

export interface loginProps{
    email: string,
    pass: string
}

export function useLogin(){
    return useMutation('login', async ({email, pass}: loginProps) => await AuthRoute.login(email, pass));
}