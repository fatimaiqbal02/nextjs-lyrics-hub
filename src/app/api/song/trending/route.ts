import { NextResponse } from "next/server";
import { connectDB } from "@/utils/index";
import mongoose, { Collection } from 'mongoose';

export const GET = async (req:any) => {

    try {
        const url = new URL(req.url)
        const pageString = url.searchParams.get("page")
        const limitParam = url.searchParams.get("limit");
        const limit = limitParam !== null ? parseInt(limitParam) : 15;

        const page = pageString !== null ? parseInt(pageString) : 1;

        await connectDB();
        const db = mongoose.connection.useDb("lyrics_meanings");
        const songsCollection: Collection = db.collection('songs');

        const data = await songsCollection.aggregate([
            {$project: {
                title: 1,
                artistName: { $arrayElemAt: ['$artists.name', 0] },
                popularity:1,
                slug:1,
                views:1,
                likes:1,
                rating:1,
                lyrics_loved_count:1,
                meaning_useful_count:1,
                ratings_count:1
            }},{$sort: { views: -1 }},{ $skip: (page - 1) * 15 },{$limit: limit}]).toArray();

        const total = await songsCollection.countDocuments();    

        return NextResponse.json({message:"Successful", success: true, status: 200, data: data, total: total});
        
    } catch (err: any) {
        return new NextResponse(err, { status: 500 })
    }
}