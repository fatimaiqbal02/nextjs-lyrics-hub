"use client"
import {
    FaComment, FaRegThumbsUp, FaShareNodes,
    FaRegThumbsDown, FaThumbsUp, FaThumbsDown,
} from "react-icons/fa6";
import Link from "next/link";
import { useState} from "react";
export const runtime = "edge"
import SaveButton from "../Save";
import RatingController from "../RatingController";

export default function SongReactions({ slug, songId, songname, onUpdateCommentType, likeCount, dislikeCount }: any) {

    const handleCommentClick = () => {
        onUpdateCommentType(1);
    };

    const [likecount, setLikeCount] = useState(likeCount)
    const [isLikeActive, setIsLikeActive] = useState(false);

    const [dislikecount, setdisLikeCount] = useState(dislikeCount)
    const [isdisLikeActive, setIsdisLikeActive] = useState(false);

    const handleLikeClick = async () => {

        try {
            if (isdisLikeActive) {
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/song/like?songId=${songId}&slug=${slug}`, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json'
                }
            });
            const fetchedData = await response.json();
            setLikeCount(fetchedData.like_count)
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

            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/song/dislike?songId=${songId}&slug=${slug}`, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json'
                }
            });
            const fetchedData = await response.json();
            setdisLikeCount(fetchedData.dislike_count)
            setIsdisLikeActive((prevState) => !prevState);

        } catch (err) {
            console.log(err);
        }
    }

    return (
        <>
            <RatingController songId={songId} slug={slug} songname={songname}/>

            <div className="song-reactions">
                <div className="standard-icon">

                    <i onClick={handleLikeClick} style={{ opacity: isdisLikeActive ? 0.5 : 1, cursor: isdisLikeActive ? 'not-allowed' : 'pointer' }}>
                        {isLikeActive ? <FaThumbsUp /> : <FaRegThumbsUp />}
                    </i> {likecount && parseInt(likecount) !== 0 ? likecount : null} |

                    <i onClick={handleDisLikeClick} style={{ opacity: isLikeActive ? 0.5 : 1, cursor: isLikeActive ? 'not-allowed' : 'pointer' }}>
                        {isdisLikeActive ? <FaThumbsDown /> : <FaRegThumbsDown />}
                    </i> {dislikecount && parseInt(dislikecount) !== 0 ? dislikecount : null}

                    <div className="title">Like | Dislike</div>
                </div>
                
                <div className="standard-icon">
                    <i><FaShareNodes /></i>
                    <div className="title">Share</div>
                </div>

                <SaveButton songId={songId}/>
                
                <div className="standard-icon">
                    <Link href={'#comments'} onClick={handleCommentClick}><i><FaComment /></i></Link>
                    <div className="title">Comment</div>
                </div>
            </div>
        </>
    )
}