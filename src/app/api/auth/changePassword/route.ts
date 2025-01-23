import { NextResponse } from "next/server";
import { connectDB } from "@/utils/index";
import mongoose, { Collection } from 'mongoose';
import bcrypt from "bcryptjs";

export const PATCH = async (request: any) => {
    const { oldPassword, newPassword } = await request.json();
    console.log('Received data:', { oldPassword, newPassword });

    try {
        await connectDB();
        const db = mongoose.connection.useDb("lyrics_meanings");
        const usersCollection: Collection = db.collection('users');

        const allUsers = await usersCollection.find({}).toArray();
        const existingUser = allUsers.find(user => bcrypt.compareSync(oldPassword, user.password));

        if (!existingUser) {
            return new NextResponse("Old password is incorrect", { status: 400 });
        }

        else if (existingUser) {

            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(newPassword, salt);

            await usersCollection.updateOne({ _id: existingUser._id }, { $set: { password: hashedPassword} });

            return new NextResponse("Password changed Succesfully", { status: 200 });
        }
        

    } catch (err: any) {
        return new NextResponse(err, { status: 500 })
    }
}
