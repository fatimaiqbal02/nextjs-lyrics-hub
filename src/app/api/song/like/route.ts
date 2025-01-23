import { NextResponse } from "next/server";
import { connectDB } from "@/utils/index";
import mongoose, { Collection } from 'mongoose';
import { createHash } from 'crypto';

export const PUT = async (req: any) => {
    const url = new URL(req.url);
    const songId = url.searchParams.get("songId");
    const slug = url.searchParams.get("slug");

    if (!songId) {
        return NextResponse.json({ message: "Song Id not provided", success: false, status: 400 });
    }

    try {
        await connectDB();
        const db = mongoose.connection.useDb("lyrics_meanings");
        const songsCollection: Collection = db.collection('songs');
        const reactionsCollection: Collection = db.collection('songs_reactions');

        const existingSessionId = req.cookies.get('sessionId').value;

        const currentDate = new Date().toISOString().split('T')[0];

        const concatenatedString = `${existingSessionId}${songId}${currentDate}`;
        const sha256Hash = createHash('sha256').update(concatenatedString).digest('hex');

        const existingReaction = await reactionsCollection.findOne({ hash: sha256Hash, type: 3 });

        let update = {};

        if (existingReaction) {
            update = { $inc: { like_count: -1 } };
            await reactionsCollection.deleteOne({
                song_id: songId,
                hash: sha256Hash,
                datetime_added: currentDate,
                type: 3
            });
        
        } else {
            update = { $inc: { like_count: 1 } };

            await reactionsCollection.insertOne({
                song_id: songId,
                hash: sha256Hash,
                datetime_added: currentDate,
                type: 3
            });
        }

        const data = await songsCollection.findOneAndUpdate(
            { slug: slug},
            update,
            { returnDocument: 'after' }
        );

        if (!data) {
            return new NextResponse("Unsuccessful", { status: 400 });
        }

        return NextResponse.json({
            message: "Successful",
            success: true,
            status: 200,
            like_count: data.like_count
        });

    } catch (err: any) {
        return new NextResponse(err, { status: 500 });
    }
};

export const GET = async (req: any) => {
    const url = new URL(req.url);
    const songId = url.searchParams.get("songId");
    const slug = url.searchParams.get("slug");

    if (!songId) {
        return NextResponse.json({ message: "Song Id not provided", success: false, status: 400 });
    }

    try {
        await connectDB();
        const db = mongoose.connection.useDb("lyrics_meanings");
        const songsCollection: Collection = db.collection('songs');
        
        const data = await songsCollection.findOne(
            { slug: slug},
        );

        if (!data) {
            return new NextResponse("Unsuccessful", { status: 400 });
        }

        return NextResponse.json({
            message: "Successful",
            success: true,
            status: 200,
            like_count: data.like_count
        });

    } catch (err: any) {
        return new NextResponse(err, { status: 500 });
    }
};
