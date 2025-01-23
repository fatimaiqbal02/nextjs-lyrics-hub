import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic'

export const GET = async (req: any) => {

  const sessionId = req.cookies.get("sessionId");

  if (sessionId) {
    return NextResponse.json({message:"Successful", success: true, status: 200, sessionId: sessionId.value});
        
  } else {
    return NextResponse.json({message:"No session id present", success: false, status: 500});
        
  }
}