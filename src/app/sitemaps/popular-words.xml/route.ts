import { NextResponse } from "next/server";
import { connectDB } from "@/utils/index";
import mongoose, { Collection } from 'mongoose';

export const GET = async (req: any) => {
    try {
        await connectDB();
        const db = mongoose.connection.useDb("lyrics-data");
        const lyricsCollection: Collection = db.collection('lyrics_keywords');

        const data = await lyricsCollection.find({}, { projection: { keyword: 1 } }).limit(30).toArray();
        const urls = data.map(lyrics => `${process.env.NEXT_PUBLIC_BASE_URL}/popular/${lyrics.keyword}`);

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls.map(url => `<url><loc>${url}</loc></url>`).join('')}
</urlset>`;

        return new Response(sitemap, {
            headers: { 'Content-Type': 'application/xml' },
        });

    } catch (err: any) {
        return new NextResponse(err, { status: 500 });
    }
};
