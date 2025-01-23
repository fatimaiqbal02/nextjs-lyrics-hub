import { NextResponse } from "next/server";
import { connectDB } from "@/utils/index";
import mongoose, { Collection } from 'mongoose';
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const POST = async (request: any) => {
    try {

        const response =  NextResponse.json({message:"Logout Successful", success: true, status: 200});

        response.cookies.set('token', "", {
            httpOnly: true,
            expires: new Date(0)
        });

        return response;

    } catch (err: any) {
        return new NextResponse(err, { status: 500 })
    }
}
