"use client"
import { useState } from "react"
import Image from "next/image"
import SignupImg from '../../../public/images/Signup.svg'
import '../../shared/form.css'
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SignupForm() {
    const [error, seterror] = useState("")
    const router = useRouter()

    const validEmail = (email: string) => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        return emailRegex.test(email);
    }

    const validName = (name: string) => {
        const nameRegex = /^[a-zA-Z]+ [a-zA-Z]+$/;
        return nameRegex.test(name);
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const name = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;

       /*  console.log(name, email, password); */

        if (!validName(name)) {
            seterror("Name must include both first and last name");
            return;
        }

        if (!validEmail(email)) {
            seterror("Email is invalid");
            return;
        }

        if (!password || password.length < 8) {
            seterror("Password length must be greater then 8");
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });
            if (res.status == 400) {
                seterror("This email is already registered");
            } else if (res.status == 200) {
                seterror(" ");
                router.push("/login");
            }

        } catch (err) {
            seterror("Error Try again..")
        }
    }

    return (
        <section className="form-section">
            <div className="row">

                <div className="image">
                    <Image src={SignupImg} alt="" priority={true}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                </div>
                <form onSubmit={handleSubmit}>
                    <p>Sign up now for an immersive journey into song meanings and lyrics at LyricsHub.com.</p>
                    <div className="inputBox">
                        <input type="text" placeholder="Name" className="box" required />
                    </div>
                    <div className="inputBox">
                        <input type="Email" placeholder="Email" className="box" required />
                    </div>
                    <div className="inputBox">
                        <input type="password" placeholder="Password" className="box" required />
                    </div>
                    <p className="eror-message">{error && error}</p>
                    <input type="submit" className="btn" value="Sign Up" />
                    <p className="msg">Already have an Account? <Link href={'/login'}>Log In</Link></p>
                </form>
            </div>

        </section>
    )
}