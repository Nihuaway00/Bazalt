'use client'
import {useState} from "react";
import {useRegistration} from "@/routes/auth/hooks/useRegistration";

export default function RegistrationForm() {
    const [email, setEmail] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [pass, setPass] = useState<string>('');
    const onRegistration = useRegistration();
    function registrationHandler(){
        onRegistration.mutate({username, email, pass});
    }

    return (
        <div>
            <label>Имя</label><br />
            <input value={username} onChange={(e) => setUsername(e.target.value)} type={'text'}/><br />
            <label>Почта</label><br />
            <input value={email} onChange={(e) => setEmail(e.target.value)} type={'text'}/><br />
            <label>Пароль</label><br />
            <input value={pass} onChange={(e) => setPass(e.target.value)} type={'password'}/><br /><br />
            <button onClick={registrationHandler}>Зарегестрироваться</button>
        </div>
    );
}