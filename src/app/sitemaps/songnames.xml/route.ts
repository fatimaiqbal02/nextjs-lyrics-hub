import { NextResponse } from "next/server";
import { connectDB } from "@/utils/index";
import mongoose, { Collection } from 'mongoose';

export const GET = async (req: any) => {
    try {
        await connectDB();
        const db = mongoose.connection.useDb("lyrics-data");
        const songsCollection: Collection = db.collection('songs');

        const data = await songsCollection.find({}, { projection: { slug: 1 } }).toArray();
        const urls = data.map(song => `${process.env.NEXT_PUBLIC_BASE_URL}/${song.slug}`);

      
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
