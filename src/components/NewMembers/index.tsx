"use client"
import './users.css'
import { FaRegUser } from "react-icons/fa";
import { formatDistanceToNow} from 'date-fns';
import { useState, useEffect } from 'react';
export const runtime = "edge";

export default function NewMembersList() {

    const [data, setData] = useState([]);
    
    const fetchData = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users`, {cache: "no-store"});
            const resdata = await response.json();
            setData(resdata.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    
    useEffect(() => {
        fetchData();
    }, []);
    

    return (
        <>
            {data.length > 0 ? (
                data.map((item: any) => (
                    <div className="new-member-info-item" key={item._id}>
                        <div className="user-initials"><i><FaRegUser /></i></div>
                        <div className="detail">
                            <div className="user-name">{item.name}</div>
                            <div className="user-otherdetail">
                                <div className="user-location"><i className="fa-solid fa-location-dot"></i>{item.country}</div>
                                <div className="user-dateofjoin">{formatDistanceToNow(new Date(item.created_at))} ago</div>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p>No data found</p>
            )}
        </>
    )
}