"use client"
import '../CommentsList/commentslist.css'
import {FaTrashCan } from "react-icons/fa6";
import { useState, useEffect } from 'react';
import CommentReply from '../CommentReply';
import ViewReply from '../ViewReply';
import CommentReactions from '../CommentReactions';

export default function CommentReplyList({ comments, songId, slug, active_state }: any) {

    const [activeReplyIndex, setActiveReplyIndex] = useState(-1);
    const [userSessionId, setUserSessionId] = useState(null);
    const [deletedComment, setDeletedComment] = useState(null);

    const toggleReplySection = (index: number) => {
        setActiveReplyIndex((prevState) => (prevState === index ? -1 : index));
    };

    const formatDate = (dateString: string): string => {
        const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
        const formattedDate = new Date(dateString).toLocaleDateString('en-US', options);
        return formattedDate;
    };

    const fetchUserSessionId = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/getSession`);
            const data = await response.json();
            setUserSessionId(data.sessionId);
            /* console.log(data.sessionId); */
        } catch (error) {
            console.error('Error fetching user session ID:', error);
        }
    };

    const handleDeleteComment = async (commentId: any) => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/song/comment/reply?commentId=${commentId}`, { method: 'DELETE' });
            setDeletedComment(commentId); 
        } catch (error) {
            console.error('Error deleting the comment:', error);
        }
    };

    useEffect(() => {
        fetchUserSessionId();
    },[deletedComment]);

    return (
        <>
            <div className="comment-list-section" style={{ borderBottom: 'none', display: active_state ? 'block' : 'none' }}>
                {comments.map((item: any, index: number) => (
                    item.reply_to != null && item._id !== deletedComment ? (
                        <div className="comment-list-item" key={item._id} style={{ padding: '0rem 1rem' }}>
                            <div className="comment-list-item-top">
                                <div className="user-initials">{item.user_name.split(' ').map((word: any) => word[0]).join('')}</div>
                                <div className="detail">
                                    <div className="user-name">{item.user_name}</div>
                                    <div className="user-location"><i className="fa-solid fa-location-dot"></i>{item.user_country}</div>
                                </div>
                                <div className="delete-icon" onClick={() => handleDeleteComment(item._id)}>{userSessionId == item.user_id ? <i><FaTrashCan /></i> : ""}
                                </div>
                            </div>
                            <div className="comment-type-date">
                                <div className="dateofcomment">Replied on {formatDate(item.datetime_added)}</div>
                            </div>
                            <p className="comment-line">
                                {item.comment}
                            </p>
                            <div className="comment-btns">
                                <div className="reply-btn">
                                    <span onClick={() => toggleReplySection(index)}>
                                        {activeReplyIndex === index ? 'Cancel' : 'Reply'}
                                    </span>
                                </div>
                                <CommentReactions likes={item.likes} dislikes={item.dislikes} flags={item.flags} commentId={item._id}/>
                            </div>
                            <CommentReply activeReplyIndex={activeReplyIndex === index} commentId={item._id} slug={slug} songId={songId} />
                            <ViewReply commentid={item._id} slug={slug} songId={songId} />
                        </div>
                    ) : null))
                }
            </div>
        </>
    )
}