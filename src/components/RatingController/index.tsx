"use client"
import { FaStar, FaRegStar} from "react-icons/fa6";
import { useState, useEffect } from "react";
export const runtime = "edge"

export default function RatingController({ songId, slug, songname }: any) {

    const [data, setData] = useState<any>([]);

    const fetchData = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/song/rating?slug=${songname}`)
            const fetchedData = await response.json();
            setData(fetchedData.data)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const [userRating, setUserRating] = useState<number | null>(null);
    const [ratingData, setRatingData] = useState<any>({});

    const handleStarClick = async (value: number) => {

        const newRating = userRating === value ? null : value;
        setUserRating(newRating);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/song/rating`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({ songId, slug, rating: value }),
            });

            if (response.status === 200) {
                const responseData = await response.json();
                console.log(responseData)
                setRatingData(responseData.data)

                console.log(`User rating set to: ${value}`);
                console.log(ratingData)
            } else {
                console.error(`Failed to set rating. Status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error setting rating:', error);
        }
    };

    const renderStars = () => {
        const stars = [];

        for (let i = 1; i <= 5; i++) {
            stars.push(
                <i key={i} onClick={() => handleStarClick(i)}>
                    {userRating && i <= userRating ? <FaStar /> : <FaRegStar />}
                </i>
            );
        }

        return stars;
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="song-rating">
            <div className="average-rating">{ratingData?.rating ? (ratingData.rating) : (data.rating)}</div>
            <div className="stars">
                {renderStars()}
                <div>Based on {ratingData?.ratings_count ? (ratingData.ratings_count) : (data.ratings_count)} Ratings</div>
            </div>
        </div>
    )
}