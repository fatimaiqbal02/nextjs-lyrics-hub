"use client"
import { useState, useCallback } from "react";
import { FaHeadphonesSimple, FaGlobe } from "react-icons/fa6";
import { MdOutlineMenuBook } from "react-icons/md";
export const runtime = "edge"
import React from 'react';
import SongLyric from '@/components/SongLyric';
import CommentSection from '@/components/Comments';
import MeaningsReaction from '@/components/MeaningReactions';
import LyricsReaction from '@/components/LyricsReactions';
import Image from "next/image"
import backgroundImage from '../../../public/images/backgroundMain.webp'
import SongReactions from '@/components/SongReactions';

export default function SongInfoContainer({ data, songname }: any) {

    const [commentType, setCommentType] = useState<number>(1);
    const [commentSectionKey, setCommentSectionKey] = useState(1);

    const handleCommentType = useCallback(
        (type: number) => {
            setCommentType(type);
            setCommentSectionKey((prevKey) => prevKey + 1);
        },
        [commentType]
    );

    return (
        <>
            {/* ---------------------------------- Song Introduction ------------------------------------- */}
            <div id="brief" className="song-introduction">
                <Image
                    className='background-img'
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    src={backgroundImage}
                    alt="Background Image"
                    priority={true}
                />
                {data && (
                    <div className="song-details">
                        <div className="song-artist-info">
                            <div>{data && data.artistName}</div>
                        </div>
                        <a href="#" className="song-title"><h1>{data.title}</h1></a>
                        {data.meta_description !== "" ? (
                            <p className='song-description'>{data.meta_description}</p>
                        ) : null}
                        {/* <div className="publishDate">Published on {formatDate(data.datetime_published)}</div> */}
                        <SongReactions slug={data.slug} songId={data._id} songname={songname} 
                        onUpdateCommentType={handleCommentType} likeCount={data.like_count} dislikeCount={data.dislike_count}/>
                    </div>
                )}
            </div>
            {/* ------------------x--------------- Song Introduction -------------x----------------------- */}
            {/* ------------------------------------- Song Meanings -------------------------------------- */}
            <div id='meanings' className="song-meanings">
                <h1 className="topheading"><i><MdOutlineMenuBook /></i>Meaning & Insights</h1>
                <div className="top-left-icon-lyrics">
                    <div className="standard-icon">
                        <i><FaGlobe /></i>
                        <div className="title">Request Translation</div>
                    </div>
                </div>

                <div dangerouslySetInnerHTML={{ __html: data.meaning }} />
                <MeaningsReaction slug={data.slug} textToCopy={data.meaning} songId={data._id}
                    onUpdateCommentType={handleCommentType} />

            </div>
            {/* ------------------x------------------ Song Meanings --------------x----------------------- */}
            {/* ------------------------------------- Song Lyrics --------------------------------------- */}
            <div id='lyrics' className="song-lyrics">
                <h1 className="topheading"><i><FaHeadphonesSimple /></i>Songs Lyrics</h1>
                <div className="top-left-icon-lyrics">
                    {/* <div className="standard-icon">
                            <i><FaToggleOff /></i><span>Meaning</span>
                        </div> */}
                    <div className="standard-icon">
                        <i><FaGlobe /></i>
                        <div className="title">Request Translation</div>
                    </div>
                </div>

                <SongLyric lyrics={data.lyrics} lyricsKeywords={data.lyrics_keywords_random}/>
                <LyricsReaction slug={data.slug} textToCopy={data.lyrics} songId={data._id}
                    onUpdateCommentType={handleCommentType} />

            </div>
            {/* ------------------x------------------ Song Lyrics ---------------x----------------------- */}
            {/* ------------------------------------- Comment Section ---------------------------------- */}
            <CommentSection slug={data.slug} songId={data._id} commentType={commentType} key={commentSectionKey} />
            {/* ------------------x------------------ Comment Section -----------x----------------------- */}
        </>
    )
}