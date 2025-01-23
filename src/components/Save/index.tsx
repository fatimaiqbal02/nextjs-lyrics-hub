"use client"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {FaRegBookmark} from "react-icons/fa6";
export const runtime = "edge"

export default function SaveButton({songId}:any) {

    const handleSave = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/song/collection`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({ songId })
            });

            if (response.status === 400) {
                toast.info("Please log in or sign up first.");
            } else if (response.status === 409) {
                toast.info("This song is already saved.");
            } else if (response.status === 200) {
                toast.success("Saved successfully.");
            } else {
                toast.error(`Failed to save song. Status: ${response.status}`);
            }
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <div className="standard-icon">
            <i onClick={handleSave}><FaRegBookmark /></i>
            <div className="title">Save</div>
        </div>
    )
}