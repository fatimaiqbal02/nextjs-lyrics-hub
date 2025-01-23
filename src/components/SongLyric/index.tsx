"use client"
import './songlyrics.css'
export const runtime = "edge"
import { HighlightedText } from '../HighlightedLyrics';

export default function SongLyric({ lyrics, lyricsKeywords }: any) {

    const lines = Array.isArray(lyrics) ? lyrics : lyrics.split('\n');

    return (
        <>
            {lines.map((line: string, index: number) => (
                <div className="lyrics-line" key={index}>
                    <HighlightedText text={line} keywords={lyricsKeywords} />
                </div>
            ))}
        </>
    )
}