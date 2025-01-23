import { NextResponse } from "next/server";
import { connectDB } from "@/utils/index";
import mongoose, { Collection } from 'mongoose';
import { createHash } from 'crypto';
import countryList from 'country-list';
import { ObjectId } from 'mongodb';

async function json(url: any) {
    const res = await fetch(url);
    return res.json();
}

export const POST = async (req: any) => {

    const { username, email, songId, slug, type, message, reply_to } = await req.json();

    if (!songId) {
        return NextResponse.json({ message: "Song Id not provided", success: false, status: 400 });
    }

    if (!slug) {
        return NextResponse.json({ message: "Slug not provided", success: false, status: 400 });
    }

    try {
        await connectDB();
        const db = mongoose.connection.useDb("lyrics_meanings");
        const commentsCollection: Collection = db.collection('comments');
        const reactionsCollection: Collection = db.collection('reactions');

        const existingSessionId = req.cookies.get('sessionId').value;

        const currentDate = new Date().toISOString().split('T')[0];

        const concatenatedString = `${existingSessionId}${songId}${currentDate}`;
        const sha256Hash = createHash('sha256').update(concatenatedString).digest('hex');

        const apiKey = process.env.API_KEY;
        const userIPHeader = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip");
        const userIP = userIPHeader ? userIPHeader.replace("::ffff:", "") : null;

        const ip = userIP;
        const ipData = await json(`https://api.ipdata.co/${ip}?api-key=${apiKey}`);

        const country = ipData.city + ", " + ipData.country_name;
        console.log(country);

        if (type != null) {
            const existingReaction = await reactionsCollection.findOne({ hash: sha256Hash, type: type });

            if (existingReaction) {
                await reactionsCollection.updateOne(
                    { song_id: songId, hash: sha256Hash, datetime_added: currentDate, type: type },
                    { $set: { message: message } });

                const data = await commentsCollection.updateOne(
                    { song_id: songId, user_email: email, },
                    { $set: { comment: message } });

                const updatedDocument = await commentsCollection.findOne({ song_id: songId, user_email: email, });

                return NextResponse.json({
                    message: "Updated Prev One",
                    success: true,
                    status: 200,
                    data: updatedDocument
                });

            } else {
                await reactionsCollection.insertOne({
                    song_id: songId,
                    hash: sha256Hash,
                    datetime_added: currentDate,
                    type: type,
                    message: message
                });

                const data = await commentsCollection.insertOne({
                    song_id: songId,
                    reply_to: ObjectId.isValid(reply_to) ? new ObjectId(reply_to) : null,
                    user_id: existingSessionId,
                    user_name: username,
                    user_email: email,
                    user_country: country,
                    comment: message,
                    type: type ? type : null,
                    user_ip: ip,
                    datetime_added: currentDate,
                    likes: 0,
                    dislikes: 0,
                    flags: 0
                });

                const insertedDocument = await commentsCollection.findOne({ _id: data.insertedId });

                return NextResponse.json({
                    message: "New Added Successful",
                    success: true,
                    status: 200,
                    data: insertedDocument,
                });
            }
        } else {
            const existingReaction = await commentsCollection.findOne({ user_id: existingSessionId, reply_to: new ObjectId(reply_to) });
            if(existingReaction){
                return NextResponse.json({
                    message: "Already Commented",
                    success: true,
                    status: 500,
                });
            }

            const data = await commentsCollection.insertOne({
                song_id: songId,
                reply_to: ObjectId.isValid(reply_to) ? new ObjectId(reply_to) : null,
                user_id: existingSessionId,
                user_name: username,
                user_email: email,
                user_country: country,
                comment: message,
                type: null,
                user_ip: ip,
                datetime_added: currentDate,
                likes: 0,
                dislikes: 0,
                flags: 0
            });

            const insertedDocument = await commentsCollection.findOne({ _id: data.insertedId });

            return NextResponse.json({
                message: "New Added Successful",
                success: true,
                status: 200,
                data: insertedDocument,
            });
        }


    } catch (err: any) {
        return new NextResponse(err, { status: 500 });
    }
};

export const GET = async (req: any) => {

    const url = new URL(req.url)
    const songId = url.searchParams.get("songId");

    const songIdint = songId !== null ? parseInt(songId) : "";

    if (!songId) {
        return NextResponse.json({ message: "SongId not provided", success: false, status: 400 });
    }

    try {
        await connectDB();
        const db = mongoose.connection.useDb("lyrics_meanings");
        const commentsCollection: Collection = db.collection('comments');

        const data = await commentsCollection.find({ song_id: songIdint }).toArray();

        return NextResponse.json({ message: "Successful", success: true, status: 200, data: data });

    } catch (err: any) {
        return new NextResponse(err, { status: 500 })
    }
}

export const DELETE = async (req: any) => {
    try {
        const url = new URL(req.url)
        const songId = url.searchParams.get("songId");
        const songtype = url.searchParams.get("songtype");

        const songIdint = songId !== null ? parseInt(songId) : "";

        if (!songId) {
            return NextResponse.json({ message: "SongId not provided", success: false, status: 400 });
        }

        const existingSessionId = req.cookies.get('sessionId').value;
        const currentDate = new Date().toISOString().split('T')[0];
        const concatenatedString = `${existingSessionId}${songIdint}${currentDate}`;
        const sha256Hash = createHash('sha256').update(concatenatedString).digest('hex');

        await connectDB();
        const db = mongoose.connection.useDb("lyrics_meanings");
        const commentsCollection: Collection = db.collection('comments');
        const reactionsCollection: Collection = db.collection('reactions');

        await reactionsCollection.deleteOne({ hash: sha256Hash, type: songtype });
        await commentsCollection.deleteOne({ user_id: existingSessionId, type: songtype });

        return NextResponse.json({
            message: "Comment deleted successfully",
            success: true,
            status: 200,
        });

    } catch (err: any) {
        return new NextResponse(err, { status: 500 });
    }
};