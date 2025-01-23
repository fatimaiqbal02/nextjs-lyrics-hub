"use client"
import CommentReplyList from '../CommentReplyList';
import '../CommentsList/commentslist.css'
import { useState } from 'react';
export const runtime = "edge";


export default function ViewReply({ commentid, songId, slug }: any) {

    const [replies, setReplies] = useState([]);
    const [repliesVisible, setRepliesVisible] = useState(false);

    const fetchReplies = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/song/comment/reply?commentId=${commentid}`);
            const resdata = await response.json();
            setReplies(resdata.data);
            console.log(resdata.data)
            setRepliesVisible(true);
        } catch (error) {
            console.error('Error fetching replies:', error);
        }
    };

    const hideReplies = () => {
        setRepliesVisible(false);
    };

    return (
        <div className='view-area'>
            <div className="view-reply-btn" onClick={() => (repliesVisible ? hideReplies() : fetchReplies())}>
                {repliesVisible ? 'Hide Reply' : 'View Reply'}</div>
            {replies.length > 0 && (
                <>
                    <CommentReplyList comments={replies} songId={songId} slug={slug} active_state = {repliesVisible}/>
                </>
            )}
            {replies.length === 0 && repliesVisible &&(
                <>
                    <p>No replies yet. Be the first to reply!</p>
                </>
            )}
        </div>
    )
}