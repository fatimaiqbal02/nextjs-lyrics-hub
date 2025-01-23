"use client"
import './popularwords.css'
import { FaEye } from "react-icons/fa6";

import Link from "next/link";

export default function PopularWord({keyword, views}:any) {
    
    const handleClick = async () => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/popularwords`, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({keyword})
            });
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <Link className="popular-word" href={`/popular/${keyword}`} onClick={handleClick}>
            <div className="popular-word-content">
                <div className="popular-word-name">{keyword}</div>
                <div className="popular-word-views"><i><FaEye /></i>{views} views</div>
            </div>
        </Link>
    )
}