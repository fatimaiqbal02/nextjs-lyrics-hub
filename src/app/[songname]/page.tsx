import './style.css'
import { FaUsers} from "react-icons/fa6";
export const runtime = "edge"
import React from 'react';
import NewMembersList from '@/components/NewMembers';
import SongStatistics from '@/components/SongStatistics';
import TrendingSongs from '@/components/TrendingSongs';
import SongInfoContainer from '@/components/SongInfoContainer';
import MenuBar from '@/components/MenuBar';

export default async function SongDetailPage({ params }: any) {

    const songname = params.songname;

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/song?slug=${songname}`)
    const fetchedData = await response.json();
    const data = fetchedData.data;

    /* const formatDate = (dateString: string): string => {
        const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
        const formattedDate = new Date(dateString).toLocaleDateString('en-US', options);
        return formattedDate;
    }; */

    return (
        <section className="layout-one-container">
            <div className="left">
                <MenuBar/>
            </div>

            <div className="mid">
                <SongInfoContainer data = {data} songname={songname}/>
            </div>

            <div className="right">
                <TrendingSongs />

                <div className="new-member-info">
                    <h1 className="topheading"><i><FaUsers/></i>Our New Members</h1>
                    <NewMembersList />
                </div>

                <SongStatistics />

            </div>
        </section>
    )
}