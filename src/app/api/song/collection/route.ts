import { NextResponse } from "next/server";
import { connectDB } from "@/utils/index";
import mongoose, { Collection } from 'mongoose';
import jwt from 'jsonwebtoken'; 
import { ObjectId } from 'bson'; 

interface JwtPayload {
    id: string;
}

export const POST = async (req: any) => {
    const { songId } = await req.json(); 

    if (!songId) {
        return NextResponse.json({ message: "Song Id not provided", success: false, status: 400 });
    }

    try {
        await connectDB();
        const db = mongoose.connection.useDb("lyrics_meanings");
        const favoritesCollection: Collection = db.collection('favorite_songs');

        const accessToken = req.cookies.get('token')?.value;
        if (!accessToken) {
            return NextResponse.json("Not LoggedIn User", { status: 400 });
        }

        const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET_KEY!) as JwtPayload;
        if (!decodedToken || !decodedToken.id) {
            return NextResponse.json("Invalid or missing access token", {status: 400 });
        }

        const userId = new ObjectId(decodedToken.id);

        const existingDocument = await favoritesCollection.findOne({
            user_id: userId,
            song_id: songId
        });

        if (existingDocument) {
            return new NextResponse("Song Already saved in collection", { status: 409 });
        }

        const currentDate = new Date().toISOString()

        const data = await favoritesCollection.insertOne({
            user_id: userId,
            song_id: songId,
            datetime_added: currentDate
        });

        return NextResponse.json({
            message: "Successful",
            success: true,
            status: 200,
            data: data
        });

    } catch (err: any) {
        return new NextResponse(err, { status: 500 });
    }
};
