"use client";
import Image from "next/image"
import loginImg from '../../../public/images/login.svg'
import '../../shared/form.css'
import { redirect, useRouter } from "next/navigation"
import Link from "next/link"
import { useState } from "react";

export default function LoginForm() {

    const [error, seterror] = useState("")
    const router = useRouter()

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;

        /* console.log(email, password); */

        try {
            const res = await fetch("/api/auth/login", {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({email, password })
            });
            if (res.status == 400) {
                seterror("Invalid Email or Password");
            } else if (res.status == 200) {
                seterror(" ");
                router.push("/");
            }

        } catch (err) {
            seterror("Error Try again..")
        }
    }
    return (
        <section className="form-section">
            <div className="row">

                <div className="image">
                    <Image src={loginImg} alt="" priority={true} 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"/>
                </div>
                <form onSubmit={handleSubmit}>
                    <p>Unlock the symphony of your favorite songs. Login to dive into a world of lyrics, meanings, and harmonious discoveries.</p>
                    <div className="inputBox">
                        <input type="Email" placeholder="Email" className="box" />
                    </div>
                    <div className="inputBox">
                        <input type="password" placeholder="Password" className="box" />
                    </div>
                    <p className="eror-message">{error && error}</p>
                    <input type="submit" className="btn" value="Log In" />
                    <p className="msg">Dont have an Account? <Link href={'/signup'}>Sign Up</Link></p>
                </form>
            </div>

        </section>

    )
}