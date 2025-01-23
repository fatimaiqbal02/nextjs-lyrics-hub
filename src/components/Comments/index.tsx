"use client"
import './comments.css'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaComment } from "react-icons/fa6";
import { useState, useEffect } from 'react';
import { FaCircleExclamation } from "react-icons/fa6";
import CommentsList from '../CommentsList';

export default function CommentSection({songId, slug, commentType}:any) {

    const [comments, setComments] = useState<any[]>([]);
    const [selectedType, setSelectedType] = useState(commentType.toString());
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        type: commentType.toString(),
        message: '',
        songId: songId,
        slug: slug,
    });

    const handleChange = (e:any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (e: any) => {
        const newSelectedType = e.target.value;
        setFormData((prevData) => ({ ...prevData, type: selectedType }));
        setSelectedType(newSelectedType);
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
                toast.success('Comment Posted Sucessfully');
                console.log('Data:', data);
                setFormData({
                    username: '',
                    email: '',
                    type: '',
                    message: '',
                    songId: songId,
                    slug: slug,
                });
                setComments([...comments, data]);

            } else {
                toast.error('Failed to Post Comment');
                console.error('Error:', response.statusText);
            }
        } catch (error:any) {
            console.error('Error:', error.message);
        }
    };

    useEffect(() => {
        setSelectedType(commentType.toString());
      }, [commentType]);

    return (
        <>
        <div id='comments' className="comment-section">
            <h1 className="topheading"><i><FaComment/></i>Share Your Thoughts</h1>
            <form onSubmit={handleSubmit}>
                <div className="inputBox">
                    <input type="text" placeholder="Name" className="box" name="username"
                        value={formData.username} onChange={handleChange} />
                    <input type="email" placeholder="Email" className="box" name="email"
                        value={formData.email} onChange={handleChange}/>
                </div>
                <select name="type" className="box" value={selectedType} onChange={handleSelectChange}>
                    <option value="1"  onChange={handleSelectChange}>Comment</option>
                    <option value="2">Meaning Correction</option>
                    <option value="3">Lyrics Correction</option>
                    <option value="4">Review</option>
                    <option value="5">Question</option>
                </select>
                <textarea placeholder="Comment" name="message" cols={30} rows={10} className="box"
                    value={formData.message} onChange={handleChange}></textarea>
                <input type="submit" className="btn" value="Post Comment" />
            </form>
            <div className="side-buttons">
                <div className="standard-icon">
                    <i><FaCircleExclamation /></i>
                    <div className="title">Report</div>
                </div>
            </div>
        </div>
        <CommentsList songId ={songId} comments={comments} slug={slug}/>
        </>
    )
}