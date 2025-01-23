import { NextResponse } from "next/server";
import { connectDB } from "@/utils/index";
import mongoose, { Collection } from 'mongoose';

interface AggregationResult {
    _id: null;
    totalLikes?: number;
    totalViews?: number;
}

export const GET = async () => {
    try {
        await connectDB();
        const db = mongoose.connection.useDb("lyrics_meanings");
        const songsCollection: Collection = db.collection('songs');

        // Creating indexes on necessary fields
        await songsCollection.createIndex({ datetime_published: 1 });
        await songsCollection.createIndex({ views: -1 });
        await songsCollection.createIndex({ like_count: -1 });

        // Fetching total songs count
        const totalSongs = await songsCollection.countDocuments({});

        // Fetching total likes, total views, and songs added today concurrently
        const [totalLikes, totalViews, songsAddedToday] = await Promise.all([
            songsCollection.aggregate<AggregationResult>([{ $group: { _id: null, totalLikes: { $sum: "$like_count" } } }]).next(),
            songsCollection.aggregate<AggregationResult>([{ $group: { _id: null, totalViews: { $sum: "$views" } } }]).next(),
            songsCollection.countDocuments({ datetime_published: new Date().toISOString().split('T')[0] }) as Promise<number>,
        ]);

        // Calculating average likes per song and average views per song
        const averageLikesPerSong = parseFloat(((totalLikes?.totalLikes || 0) / totalSongs).toFixed(2));
        const averageViewsPerSong = parseFloat(((totalViews?.totalViews || 0) / totalSongs).toFixed(2));

        return NextResponse.json({
            message: "Successful",
            success: true,
            status: 200,
            data: {
                totalSongs,
                totalLikes: totalLikes?.totalLikes || 0,
                totalViews: totalViews?.totalViews || 0,
                songsAddedToday,
                averageLikesPerSong,
                averageViewsPerSong,
            },
        });
    } catch (err: any) {
        return new NextResponse(err, { status: 500 });
    }
};
