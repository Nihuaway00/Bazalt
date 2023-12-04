import RegistrationForm from "@/app/auth/registration/RegistrationForm";
import Link from "next/link";

export default function RegistrationPage(){
    return (
        <div>
            <div>
                <h2>Регистрация</h2>
                <Link href={'/auth/login'}>
                    <h5>Уже есть аккаунт?</h5>
                </Link>
            </div>
            <RegistrationForm />
        </div>
    )
}