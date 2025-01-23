import { NextResponse } from "next/server";
import { connectDB } from "@/utils/index";
import mongoose, { Collection } from 'mongoose';
export const dynamic = 'force-dynamic'

export const GET = async () => {

    try {
        await connectDB();
        const db = mongoose.connection.useDb("lyrics_meanings");
        const usersCollection: Collection = db.collection('users');

        const data = await usersCollection.aggregate([
            { $sort: { created_at: -1 } },
            { $limit: 4 }]).toArray();

        return NextResponse.json({message:"Successful", success: true, status: 200, data: data});
        
    } catch (err: any) {
        return new NextResponse(err, { status: 500 })
    }
}