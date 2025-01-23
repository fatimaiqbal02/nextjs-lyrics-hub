// Import necessary modules
import { NextResponse } from "next/server";
import { connectDB } from "@/utils/index";
import mongoose from 'mongoose';
export const dynamic = "force-dynamic"

export const GET = async (req:any) => {

    try {
        await connectDB();
        const db = mongoose.connection.useDb("lyrics_meanings");
        const songsCollection = db.collection('songs');

        const url = new URL(req.url)
        const title = url.searchParams.get("title")

        if (!title) {
            return NextResponse.json({ message: "Title not provided", success: false, status: 400 });
        }
        
        const searchResults = await songsCollection.aggregate([
            {$match: {title: { $regex: new RegExp(title, 'i') }}},
            {$project: {
                title: 1,
                artistName: { $arrayElemAt: ['$artists.name', 0] },
                slug: 1
            }},{$limit: 7}]).toArray();

        return NextResponse.json({ message: "Successful", success: true, status: 200, data: searchResults });

    } catch (error) {
        console.error('Error processing search:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
};
