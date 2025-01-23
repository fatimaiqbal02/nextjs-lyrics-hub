import { NextResponse } from "next/server";
import { connectDB } from "@/utils/index";
import mongoose, { Collection } from 'mongoose';
import bcrypt from "bcryptjs";

async function json(url:any) {
    const res = await fetch(url);
    return res.json();
}

export const POST = async (request: any) => {
    const { name, email, password} = await request.json();
    console.log('Received data:', { name, email, password});

    try {
        await connectDB();
        const db = mongoose.connection.useDb("lyrics_meanings");
        const usersCollection: Collection = db.collection('users');

        const existingUser = await usersCollection.findOne({ email })
        if (existingUser) {
            return new NextResponse("Email Already In Use", { status: 400 });
        }

        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = await bcrypt.hash(password, salt);
        const created_at = new Date().toISOString();

        const apiKey = process.env.API_KEY;
        
        const userIPHeader = request.headers.get("x-forwarded-for") || request.headers.get("cf-connecting-ip");
        const userIP = userIPHeader ? userIPHeader.replace("::ffff:", "") : null;

        const ip = userIP;
        const ipData = await json(`https://api.ipdata.co/${ip}?api-key=${apiKey}`);

        const country = ipData.city + ", " + ipData.country_name;

        await usersCollection.insertOne({ name, email, password: hashedPassword, country, ip, created_at })

        return new NextResponse("User is Registered", { status: 200 });

    } catch (err: any) {
        return new NextResponse(err, { status: 500 })
    }
}
