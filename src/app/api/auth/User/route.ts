import { getDatafromToken } from "@/utils/getDatafromToken";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/index";
import mongoose, { Collection } from 'mongoose';
import { ObjectId } from 'mongodb';
export const dynamic = 'force-dynamic'

export const GET = async (req: NextRequest) => {

    try {
        await connectDB();
        const db = mongoose.connection.useDb("lyrics_meanings");
        const usersCollection: Collection = db.collection('users');

        const userId = await getDatafromToken(req);
        const data = await usersCollection.findOne(
            { _id: ObjectId.isValid(userId) ? new ObjectId(userId) : userId},
            { projection: { name: 1 , email: 1 }}
        );

        return NextResponse.json({message: "Successfull", data: data})
        
    } catch (err: any) {
        return new NextResponse(err.message, { status: 500 })
    }
}