import { NextResponse } from "next/server";
import { connectDB } from "@/utils/index";
import mongoose, { Collection } from 'mongoose';

export const GET = async (req: any) => {

    const url = new URL(req.url)
    const slug = url.searchParams.get("slug")

    if (!slug) {
        return NextResponse.json({ message: "Slug not provided", success: false, status: 400 });
    }

    try {
        await connectDB();
        const db = mongoose.connection.useDb("lyrics_meanings");
        const songsCollection: Collection = db.collection('songs');

        const data = await songsCollection.aggregate([
            { $match: { slug: slug } },
            { $addFields: { artistName: { $arrayElemAt: ['$artists.name', 0] } } },
            { $project: { artists: 0 } }]).next();

        await songsCollection.updateOne(
            { slug: slug },
            { $inc: { views: 1 } }
        );

        return NextResponse.json({ message: "Successful", success: true, status: 200, data: data });

    } catch (err: any) {
        return new NextResponse(err, { status: 500 })
    }
}