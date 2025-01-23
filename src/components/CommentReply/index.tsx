"use client"
import './commentreply.css'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';
export default function CommentReply({activeReplyIndex, commentId, slug, songId}:any) {

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        reply_to: commentId,
        message: '',
        songId: songId,
        slug: slug,
    });

    const handleChange = (e:any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e:any) => {
        e.preventDefault();

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/song/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                toast.success('Reply Posted Successfully');
                console.log('Data:', data);
                setFormData({
                    username: '',
                    email: '',
                    reply_to: '',
                    message: '',
                    songId: songId,
                    slug: slug,
                });
            } else {
                toast.error('Failed to Post Reply');
                console.error('Error:', response.statusText);
            }
        } catch (error:any) {
            console.error('Error:', error.message);
        }
    };


    return (
        <div className={`comment-reply-section ${activeReplyIndex ? 'active' : ''}`}>
            <form onSubmit={handleSubmit}>
                <div className="inputBox">
                    <input type="text" placeholder="Name" className="box" name="username"
                    value={formData.username} onChange={handleChange} />
                    <input type="email" placeholder="Email" className="box" name="email"
                    value={formData.email} onChange={handleChange} />
                </div>
                <div className="comment-reply-area">
                    <textarea placeholder="Comment" name="message" cols={30} rows={1} className="box" value={formData.message} onChange={handleChange}></textarea>
                    <input type="submit" className="btn" value="reply" />
                </div>
            </form>
        </div>

    )
}