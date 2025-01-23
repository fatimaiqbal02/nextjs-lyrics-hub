import { NextResponse } from "next/server";
import { connectDB } from "@/utils/index";
import mongoose, { Collection } from 'mongoose';
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const POST = async (request: any) => {
    const { email, password } = await request.json();
    console.log('Received data:', { email, password });

    try {
        await connectDB();
        const db = mongoose.connection.useDb("lyrics_meanings");
        const usersCollection: Collection = db.collection('users');

        const user = await usersCollection.findOne({ email })
        if (!user) {
            return new NextResponse("Invalid Email", { status: 400 });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            return new NextResponse("Invalid password", { status: 400 });
        }

        const tokenData = jwt.sign({ id: user._id, email: user.email },
            process.env.JWT_SECRET_KEY!, { expiresIn: "15d" })
        
        const response =  new NextResponse("User Succesfully Login", { status: 200 });
        response.cookies.set('token', tokenData, {
            httpOnly: true,
        })

        return response;

    } catch (err: any) {
        return new NextResponse(err, { status: 500 })
    }
}
