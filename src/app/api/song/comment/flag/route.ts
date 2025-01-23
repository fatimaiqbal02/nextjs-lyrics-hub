import { NextResponse } from "next/server";
import { connectDB } from "@/utils/index";
import mongoose, { Collection } from 'mongoose';
import { createHash } from 'crypto';
import { ObjectId } from 'mongodb';

export const PUT = async (req: any) => {
    const url = new URL(req.url);
    const commentId = url.searchParams.get("commentId");

    if (!commentId) {
        return NextResponse.json({ message: "Comment Id not provided", success: false, status: 400 });
    }

    try {
        await connectDB();
        const db = mongoose.connection.useDb("lyrics_meanings");
        const commentsCollection: Collection = db.collection('comments');
        const reactionsCollection: Collection = db.collection('comments_reactions');

        const existingSessionId = req.cookies.get('sessionId').value;

        const currentDate = new Date().toISOString().split('T')[0];

        const concatenatedString = `${existingSessionId}${commentId}${currentDate}`;
        const sha256Hash = createHash('sha256').update(concatenatedString).digest('hex');

        const existingReaction = await reactionsCollection.findOne({ hash: sha256Hash, action: "flag", comment_id: ObjectId.isValid(commentId) ? new ObjectId(commentId) : commentId 
    });

        let update = {};

        if (existingReaction) {
            update = { $inc: { flags: -1 } };
            await reactionsCollection.deleteOne({
                hash: sha256Hash, 
                action: "flag", 
                comment_id: ObjectId.isValid(commentId) ? new ObjectId(commentId) : commentId 
            });
        
        } else {
            update = { $inc: { flags: 1 } };

            await reactionsCollection.insertOne({
                hash: sha256Hash, 
                action: "flag", 
                comment_id: ObjectId.isValid(commentId) ? new ObjectId(commentId) : commentId 
            });
        }

        const data = await commentsCollection.findOneAndUpdate(
            { _id: new ObjectId(commentId)},
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
            flags: data.flags
        });

    } catch (err: any) {
        return new NextResponse(err, { status: 500 });
    }
};


export const GET = async (req: any) => {
    const url = new URL(req.url);
    const commentId = url.searchParams.get("commentId");
    if (!commentId) {
        return NextResponse.json({ message: "CommentId not provided", success: false, status: 400 });
    }

    try {
        await connectDB();
        const db = mongoose.connection.useDb("lyrics_meanings");
        const commentsCollection: Collection = db.collection('comments');
        
        const data = await commentsCollection.findOne(
            { _id: new ObjectId(commentId)},
        );

        if (!data) {
            return new NextResponse("Unsuccessful", { status: 400 });
        }

        return NextResponse.json({
            message: "Successful",
            success: true,
            status: 200,
            flags: data.flags
        });

    } catch (err: any) {
        return new NextResponse(err, { status: 500 });
    }
};
