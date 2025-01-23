import { NextResponse } from "next/server";
import { connectDB } from "@/utils/index";
import mongoose, { Collection } from 'mongoose';

export const GET= async () => {

    try {
        await connectDB();
        const db = mongoose.connection.useDb("lyrics_meanings");
        const popularCollection: Collection = db.collection('lyrics_keywords');

        const data = await popularCollection.find().sort({ views: -1 }).limit(30).toArray();
        return NextResponse.json({message:"Successful", success: true, status: 200, data: data});
        
    } catch (err: any) {
        return new NextResponse(err, { status: 500 })
    }
}

export const PUT= async (request: any) => {

    const { keyword } = await request.json();
    console.log(keyword);

    try {
        await connectDB();
        const db = mongoose.connection.useDb("lyrics_meanings");
        const popularCollection: Collection = db.collection('lyrics_keywords');

        const result = await popularCollection.findOneAndUpdate({ keyword: keyword },{ $inc: { views: 1 } });
        if(!result){
            return new NextResponse("Unsuccesfull", { status: 400 });
        }
        return new NextResponse("View Updated", { status: 200 });
        
    } catch (err: any) {
        return new NextResponse(err, { status: 500 })
    }
}