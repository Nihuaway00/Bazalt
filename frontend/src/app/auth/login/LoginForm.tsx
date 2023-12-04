'use client'
import {AuthRoute} from "@/routes/auth/AuthRoute";
import {IAuthService} from "@/routes/auth/IAuthService";
import {useMutation, useQuery} from "react-query";
import {useState} from "react";
import {useLogin} from "@/routes/auth/hooks/useLogin";

export default function LoginForm(){
    const [email, setEmail] = useState<string>('');
    const [pass, setPass] = useState<string>('');
    const onLogin = useLogin();
    function loginHandler(){
        onLogin.mutate({email, pass});
    }

    return (
        <div>
            <label>Почта</label><br />
            <input value={email} onChange={(e) => setEmail(e.target.value)} type={'text'}/><br />
            <label>Пароль</label><br />
            <input value={pass} onChange={(e) => setPass(e.target.value)} type={'password'}/><br /><br />
            <button onClick={loginHandler}>Войти</button>
        </div>
    );
}