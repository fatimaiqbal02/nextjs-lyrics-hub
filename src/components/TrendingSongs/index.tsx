'use client'
import { useState, useEffect } from "react"
import SongInfoBox from "../SongInfoBox"
import './trendingsongs.css'
export const runtime = "edge"
import { FaArrowUpRightDots } from "react-icons/fa6";

export default function TrendingSongs() {
    
    const [data, setData] = useState([]);

    const fetchData = async () => {
        try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/song/trending?limit=5`);
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
        <div className="trending-songs">
           <h1 className="topheading"><i><FaArrowUpRightDots/></i>Trending Songs</h1>
            <div className="songs-container">
            {data.map((item:any) => (
                    <SongInfoBox key={item._id} title={item.title} artist={item.artistName}
                    views = {item.views} likes = {item.likes} rating={item.rating} 
                    lyrics_loved_count = {item.lyrics_loved_count} meaning_useful_count = {item.meaning_useful_count}
                    ratingCount = {item.ratings_count} slug={item.slug}/>
            ))}
            </div>
            
        </div>
    )
}