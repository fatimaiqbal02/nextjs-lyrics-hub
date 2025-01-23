"use client"
import './commentslist.css'
import { GoDotFill } from "react-icons/go";
import { FaTrashCan } from "react-icons/fa6";
import { useState, useEffect } from 'react';
import { IoPeople } from "react-icons/io5";
import CommentReply from '../CommentReply';
import ViewReply from '../ViewReply';
import CommentReactions from '../CommentReactions';

export default function CommentsList({ songId, comments, slug }: any) {

    const [data, setData] = useState([]);
    const [userSessionId, setUserSessionId] = useState(null);
    const [activeReplyIndex, setActiveReplyIndex] = useState(-1);

    const toggleReplySection = (index: number) => {
        setActiveReplyIndex((prevState) => (prevState === index ? -1 : index));
    };

    const fetchData = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/song/comment?songId=${songId}`);
            const resdata = await response.json();
            setData(resdata.data);
            /* console.log(resdata.data) */
        } catch (error) {
        }
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

    const handleDeleteComment = async (type: string) => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/song/comment?songId=${songId}&songtype=${type}`, { method: 'DELETE' });
            fetchData();
        } catch (error) {
            console.error('Error deleting the comment:', error);
        }
    };

    const formatDate = (dateString: string): string => {
        const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
        const formattedDate = new Date(dateString).toLocaleDateString('en-US', options);
        return formattedDate;
    };

    const getCommentType = (type: string): string => {
        switch (type) {
            case '1':
                return 'Comment';
            case '2':
                return 'Meaning Correction';
            case '3':
                return 'Lyrics Correction';
            case '4':
                return 'Review';
            case '5':
                return 'Question';
            default:
                return '';
        }
    };


    useEffect(() => {
        fetchUserSessionId();
        fetchData();
    }, [comments]);

    return (
        <>
            <div className="comment-list-section">
                <h1 className="topheading"><i><IoPeople /></i>Community Comments</h1>
                <div className="comments-grid">
                    {data.length === 0 ? (
                        <p>No comments yet. Be the first to comment!</p>
                    ) : (
                        data.map((item: any, index:number) => (
                            item.reply_to === null ? (
                            <div className="comment-list-item" key={item._id}>
                                <div className="comment-list-item-top">
                                    <div className="user-initials">{item.user_name.split(' ').map((word: any) => word[0]).join('')}</div>
                                    <div className="detail">
                                        <div className="user-name">{item.user_name}</div>
                                        <div className="user-location"><i className="fa-solid fa-location-dot"></i>{item.user_country}</div>
                                    </div>
                                    <div className="delete-icon" onClick={() => handleDeleteComment(item.type)}>{userSessionId == item.user_id ? <i><FaTrashCan /></i> : ""}</div>
                                </div>
                                <div className="comment-type-date">
                                    <div className="typeofcomment">{getCommentType(item.type)}</div>
                                    <div className="dot"><i><GoDotFill /></i></div>
                                    <div className="dateofcomment">{formatDate(item.datetime_added)}</div>
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
                               <CommentReply activeReplyIndex={activeReplyIndex === index} commentId ={item._id} slug={slug} songId={songId}/>
                               <ViewReply commentid={item._id} slug={slug} songId={songId}/>
                            </div>
                        ): null))
                    )}
                </div>
            </div>
        </>
    )
}