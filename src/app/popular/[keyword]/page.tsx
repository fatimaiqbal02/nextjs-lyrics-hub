import SongInfoBox from "@/components/SongInfoBox";
export const runtime = "edge"
import { FaFire } from "react-icons/fa6";
import TrendingSongs from "@/components/TrendingSongs";

export default async function KeywordSongs({ params }: any) {

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/popularwords/songs?keyword=${params.keyword}`);
    const resdata = await response.json();

    return (
        <section className="layout-two-container">
            <div className="left">
                <h1 className="custom-heading"><i><FaFire /></i>Popular Song for {params.keyword}</h1>
                <div className="grid-container">
                    {resdata.data.length > 0 ? (
                        resdata.data.map((item:any) => (
                            <SongInfoBox key={item._id} title={item.title} artist={item.artistName}
                            views={item.views} likes={item.likes} rating={item.rating}
                            lyrics_loved_count={item.lyrics_loved_count} meaning_useful_count={item.meaning_useful_count}
                            ratingCount={item.ratings_count} slug={item.slug} />
                        ))
                    ) : (
                        <p>No data found</p>
                    )}
                </div>
            </div>
            <div className="right">
                <TrendingSongs />
            </div>
        </section>
    )
}