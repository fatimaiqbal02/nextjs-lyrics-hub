import { NextResponse } from "next/server";
import { connectDB } from "@/utils/index";
import mongoose, { Collection } from 'mongoose';
import { ObjectId } from 'mongodb';

export const GET = async (req: any) => {

    const url = new URL(req.url)
    const commentId = url.searchParams.get("commentId")

    if (!commentId) {
        return NextResponse.json({ message: "CommentId not provided", success: false, status: 400 });
    }

    try {
        await connectDB();
        const db = mongoose.connection.useDb("lyrics_meanings");
        const commentsCollection: Collection = db.collection('comments');

        const data = await commentsCollection.find({ reply_to: ObjectId.isValid(commentId) ? new ObjectId(commentId) : commentId }).toArray();

        return NextResponse.json({ message: "Successful", success: true, status: 200, data: data });

    } catch (err: any) {
        return new NextResponse(err, { status: 500 })
    }
}

export const DELETE = async (req: any) => {

    const url = new URL(req.url)
    const commentId = url.searchParams.get("commentId")

    if (!commentId) {
        return NextResponse.json({ message: "CommentId not provided", success: false, status: 400 });
    }

    try {
        await connectDB();
        const db = mongoose.connection.useDb("lyrics_meanings");
        const commentsCollection: Collection = db.collection('comments');
        const existingSessionId = req.cookies.get('sessionId').value;

        await commentsCollection.deleteOne({user_id: existingSessionId, _id: new ObjectId(commentId)})

        return NextResponse.json({ message: "Deleted Successfully", success: true, status: 200});

    } catch (err: any) {
        return new NextResponse(err, { status: 500 })
    }
}

