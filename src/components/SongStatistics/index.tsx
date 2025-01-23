"use client"
import './songstatistics.css'
import { RiHeart2Line } from "react-icons/ri";
import { Ri24HoursFill } from "react-icons/ri";
import { RiBardLine } from "react-icons/ri";
import { RiBarChartFill } from "react-icons/ri";
import { RiEyeLine } from "react-icons/ri";
import { useState, useEffect } from 'react';
import { FaChartLine } from "react-icons/fa6";
export const runtime = "edge"

export default function SongStatistics() {

    const [data, setData] = useState<any>({});

    const fetchData = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/song/statistics`);
            const fetcheddata = await response.json();
            setData(fetcheddata.data);
           /*  console.log(fetcheddata.data) */
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    return (
        <>
            {data && (
                <div className="totalSongsCount">
                    <h1 className="topheading"><i><FaChartLine/></i>Song Analytics</h1>
                    <div className="detail">
                        <div className="songs-count">
                            <div className="song-details">
                                <div className="title">Total Songs</div>
                                <div className="count">{data.totalSongs}</div>
                            </div>
                            <i><RiBarChartFill /></i>
                        </div>
                        <div className="songs-count">
                            <div className="song-details">
                                <div className="title">Songs Added Today</div>
                                <div className="count">{data.songsAddedToday}</div>
                            </div>
                            <i><Ri24HoursFill /></i>
                        </div>
                        <div className="songs-count">
                            <div className="song-details">
                                <div className="title">Total Likes</div>
                                <div className="count">{data.totalLikes}</div>
                            </div>
                            <i><RiHeart2Line /></i>
                        </div>
                        <div className="songs-count">
                            <div className="song-details">
                                <div className="title">Average Likes Per Song</div>
                                <div className="count">{data.averageLikesPerSong}</div>
                            </div>
                            <i><RiBardLine /></i>
                        </div>
                        <div className="songs-count">
                            <div className="song-details">
                                <div className="title">Average Views Per Song</div>
                                <div className="count">{data.averageViewsPerSong}</div>
                            </div>
                            <i><RiEyeLine /></i>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}