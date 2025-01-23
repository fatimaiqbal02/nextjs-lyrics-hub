"use client"
import PopularWord from "../PopularWord";
export const runtime = "edge"
import { useEffect, useState } from "react";

export default function PopularWordContainer() {
    
    const [data, setData] = useState([]);

    const fetchData = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/popularwords`);
            const fetcheddata = await response.json();
            setData(fetcheddata.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            {data.map((item: any) => (
                <PopularWord key={item._id} keyword={item.keyword} views={item.views} />
            ))}
        </>
    )
}