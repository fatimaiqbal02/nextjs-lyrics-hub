import './songinfobox.css'
import calculatePopularityIndex from '../../utils/calculatepIndex.js'
import { FaStar } from "react-icons/fa6";
import Link from 'next/link'

export default function SongInfoBox({ title, artist, views, likes, rating, 
    lyrics_loved_count, meaning_useful_count, ratingCount, slug }: any) {

    const pIndex = calculatePopularityIndex(views, likes, rating, lyrics_loved_count, meaning_useful_count);

    return (
        <Link className="song-info-box" href={`/${slug}`}>
            <div className="popularity-index">{pIndex !== null ? pIndex : 0}</div>
            <div className="detail">
                <div className="song-title">{title}</div>
                <div className="song-artist">{artist}</div>
                <div className="other-details">
                    <div className="reviews"><i><FaStar/></i> {rating}({ratingCount})</div>
                    <div className="views">{views} views</div>
                </div>
                
            </div>
        </Link>
    )
}