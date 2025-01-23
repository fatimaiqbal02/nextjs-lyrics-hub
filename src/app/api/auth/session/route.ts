import { NextResponse } from "next/server";

export const POST = async (response: any) => {
  const existingSessionId = response.cookies.get('sessionId');

  if (existingSessionId) {
    return new NextResponse("User SessionId present already");
  } else {
    try {
      const sessionId = Math.random().toString(36).substring(2, 15);

      const newResponse = new NextResponse("User SessionId Generated", { status: 200 });
      newResponse.cookies.set('sessionId', sessionId, {
        httpOnly: true
      });

      return newResponse;

    } catch (err: any) {
      return new NextResponse(err, { status: 500 });
    }
  }
};
