"use client"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {FaRegHeart, FaRegCopy, FaHeart} from "react-icons/fa6";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { useState, useEffect} from "react";
import copy from 'clipboard-copy';
import Link from "next/link";
export const runtime = "edge"

export default function LyricsReaction({slug, textToCopy, songId, onUpdateCommentType}:any) {

    const[lovecount, setLoveCount] = useState("")
    const [isActive, setIsActive] = useState(false);

    const handleCorrectionRequest = () => {
        console.log("clicked");
        onUpdateCommentType(3);
    };

    const handleClick = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/song/love?songId=${songId}&slug=${slug}`, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json'
                }});
                const fetchedData = await response.json();
                setLoveCount(fetchedData.love_count)
                setIsActive((prevState) => !prevState);
                
        } catch (err) {
            console.log(err);
        }
    }

    const handleCopyClick = () => {
        copy(textToCopy);
        toast.success('Text copied to clipboard!');
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const lovedResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/song/love?songId=${songId}&slug=${slug}`)

                const loved_Data = await lovedResponse.json();
                setLoveCount(loved_Data.love_count);
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, [songId, slug]);

    return (
        <>
            <div className="side-buttons">
                <div className="standard-icon">
                    <i onClick={handleClick}>
                        {isActive? <FaHeart /> : <FaRegHeart />}
                    </i>{lovecount && parseInt(lovecount) !== 0 ? lovecount : null}
                    <div className="title">Loved the Lyrics?</div>
                </div>
                <div className="standard-icon">
                    <i onClick={handleCopyClick}><FaRegCopy /></i>
                    <div className="title">Copy Lyrics Lines</div>
                </div>
                <Link href={'#comments'} className="standard-icon">
                    <i onClick={handleCorrectionRequest}><HiOutlinePencilAlt /></i>
                    <div className="title" >Submit Correction </div>
                </Link>
            </div>
        </>
    )
}