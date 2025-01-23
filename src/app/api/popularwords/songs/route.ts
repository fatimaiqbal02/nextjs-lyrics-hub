import { NextResponse } from "next/server";
import { connectDB } from "@/utils/index";
import mongoose, { Collection } from 'mongoose';

export const GET = async (req: any) => {
    try {
        const url = new URL(req.url)
        const keyword = url.searchParams.get("keyword")

        if (!keyword) {
            return NextResponse.json({ message: "Keyword not provided", success: false, status: 400 });
        }

        await connectDB();
        const db = mongoose.connection.useDb("lyrics_meanings");
        const songsCollection: Collection = db.collection('songs');

        const data = await songsCollection.aggregate([
            {$match: {lyrics_keywords_random: { $elemMatch: { $regex: keyword, $options: 'i' } }}
            },{$project: {
                title: 1,
                artistName: { $arrayElemAt: ['$artists.name', 0] },
                popularity: 1,
                views: 1,
                likes: 1,
                rating: 1,
                lyrics_loved_count: 1,
                meaning_useful_count: 1,
                ratings_count: 1,
                slug: 1
            }}]).toArray();

        return NextResponse.json({ message: "Successful", success: true, status: 200, data: data });

    } catch (err: any) {
        return new NextResponse(err, { status: 500 });
    }
}