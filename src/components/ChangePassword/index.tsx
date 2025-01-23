"use client";
import Image from "next/image"
import loginImg from '../../../public/images/changePsd.svg'
import '../../shared/form.css'
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ChangePasswordForm() {

    const [error, seterror] = useState("")
    const router = useRouter()

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const oldPassword = e.target[0].value;
        const newPassword = e.target[1].value;

        console.log(oldPassword, newPassword);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/changePassword`, {
                method: 'PATCH',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({oldPassword, newPassword })
            });
            if (res.status == 400) {
                seterror("Old password is incorrect");
            } else if (res.status == 200) {
                seterror(" ");
                toast.success("Password Changed Successfully")
                router.push("/");
            }

        } catch (err) {
            seterror("Error Try again..")
            console.log(err);
        }
    }
    return (
        <section className="form-section">
            <div className="row">

                <div className="image">
                    <Image src={loginImg} alt="" priority={true}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                </div>
                <form onSubmit={handleSubmit}>
                    <p>Secure your account to explore a realm of enhanced protection. Update your password and continue your journey with confidence.</p>
                    <div className="inputBox">
                        <input type="password" placeholder="Old Password" className="box" />
                    </div>
                    <div className="inputBox">
                        <input type="password" placeholder="New Password" className="box" />
                    </div>
                    <p className="eror-message">{error && error}</p>
                    <input type="submit" className="btn" value="Change Password" />
                </form>
            </div>

        </section>

    )
}