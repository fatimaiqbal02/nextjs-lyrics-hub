import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const getDatafromToken = (req: NextRequest)=>{
    try{
        const token = req.cookies.get('token')?.value || '';
        if (!token) {
            return null;
        }

        const decodedToken:any = jwt.verify(token, process.env.JWT_SECRET_KEY!)
        return decodedToken.id;

    }catch(err:any){
        throw new Error(err.message);
    }
}