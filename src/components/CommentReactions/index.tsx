"use client"
import { useState} from "react";
import { FaRegThumbsUp, FaRegThumbsDown, FaThumbsUp, FaThumbsDown} from "react-icons/fa6";
import { FaRegFlag, FaFlag } from "react-icons/fa";

export default function CommentReactions({likes, dislikes, flags, commentId}:any) {

    const [likecount, setLikeCount] = useState(likes)
    const [isLikeActive, setIsLikeActive] = useState(false);

    const [dislikecount, setdisLikeCount] = useState(dislikes)
    const [isdisLikeActive, setIsdisLikeActive] = useState(false);

    const [flagcount, setflagCount] = useState(flags)
    const [isflagActive, setIsflagActive] = useState(false);

    const handleLikeClick = async () => {

        try {
            if (isdisLikeActive) {
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/song/comment/like?commentId=${commentId}`, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json'
                }
            });
            const fetchedData = await response.json();
            setLikeCount(fetchedData.likes)
            setIsLikeActive((prevState) => !prevState);

        } catch (err) {
            console.log(err);
        }
    }

    const handleDisLikeClick = async () => {

        try {
            if (isLikeActive) {
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/song/comment/dislike?commentId=${commentId}`, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json'
                }
            });
            const fetchedData = await response.json();
            setdisLikeCount(fetchedData.dislikes)
            setIsdisLikeActive((prevState) => !prevState);

        } catch (err) {
            console.log(err);
        }
    }

    const handleFlagClick = async () => {

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/song/comment/flag?commentId=${commentId}`, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json'
                }
            });
            const fetchedData = await response.json();
            setflagCount(fetchedData.flags)
            setIsflagActive((prevState) => !prevState);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="right-btns">
            <div className="like-btn">
                <i onClick={handleLikeClick} style={{ opacity: isdisLikeActive ? 0.5 : 1, cursor: isdisLikeActive ? 'not-allowed' : 'pointer' }}>
                    {isLikeActive ? <FaThumbsUp /> : <FaRegThumbsUp />}
                </i>
                <span>{likecount && parseInt(likecount) !== 0 ? likecount : null}</span>
            </div>
            <div className="dislike-btn">
                <i onClick={handleDisLikeClick} style={{ opacity: isLikeActive ? 0.5 : 1, cursor: isLikeActive ? 'not-allowed' : 'pointer' }}>
                    {isdisLikeActive ? <FaThumbsDown /> : <FaRegThumbsDown />}
                </i>
                <span>{dislikecount && parseInt(dislikecount) !== 0 ? dislikecount : null}</span>
            </div>
            <div className="flag-btn">
                <i onClick={handleFlagClick}>
                    {isflagActive? <FaFlag /> : <FaRegFlag /> }
                </i>
                <span>{flagcount && parseInt(flagcount) !== 0 ? flagcount : null}</span>
            </div>
        </div>
    )
}