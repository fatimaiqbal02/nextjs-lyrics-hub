"use client"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaRegCopy } from "react-icons/fa6";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { BsCheckSquare, BsCheckSquareFill } from "react-icons/bs";
import { useState, useEffect } from "react";
import copy from 'clipboard-copy';
export const runtime = "edge"
import Link from "next/link";

export default function MeaningsReaction({ slug, textToCopy, songId, onUpdateCommentType }: any) {

    const [usefulcount, setUsefulCount] = useState("")
    const [isActive, setIsActive] = useState(false);

    const handleCorrectionRequest = () => {
        console.log("clicked");
        onUpdateCommentType(2);
    };

    const handleClick = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/song/useful?songId=${songId}&slug=${slug}`, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json'
                }
            });
            const fetchedData = await response.json();
            setUsefulCount(fetchedData.useful_count)
            setIsActive((prevState) => !prevState);

        } catch (err) {
            console.log(err);
        }
    }


    const handleCopyClick = () => {
        const textWithoutPTags = textToCopy.replace(/<\/?p>/g, '');
        copy(textWithoutPTags);
        toast.success('Text copied to clipboard!');
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usefulResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/song/useful?songId=${songId}&slug=${slug}`)

                const usefulData = await usefulResponse.json();
                setUsefulCount(usefulData.useful_count);
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
                        {isActive ? <BsCheckSquareFill /> : <BsCheckSquare />}
                    </i>{usefulcount && parseInt(usefulcount) !== 0 ? usefulcount : null}
                    <div className="title">Found It Useful?</div>
                </div>
                <div className="standard-icon">
                    <i onClick={handleCopyClick}><FaRegCopy /></i>
                    <div className="title">Copy Meanings</div>
                </div>
                <Link href={'#comments'} className="standard-icon">
                    <i onClick={handleCorrectionRequest}><HiOutlinePencilAlt /></i>
                    <div className="title" >Submit Correction </div>
                </Link>
            </div>
        </>
    )
}