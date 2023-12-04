import LoginForm from "@/app/auth/login/LoginForm";
import Link from "next/link";

export default function LoginPage(){
    return (
        <div>
            <div>
                <h2>Войти</h2>
                <Link href={'/auth/registration'}>
                    <h5>Нужна регистрация?</h5>
                </Link>
            </div>
            <LoginForm/>
        </div>
    )
}