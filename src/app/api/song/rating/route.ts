import { NextResponse } from "next/server";
import { connectDB } from "@/utils/index";
import mongoose, { Collection } from 'mongoose';
import { createHash } from 'crypto';

export const POST = async (req: any) => {
    try {
        const { songId, slug, rating } = await req.json();

        if (!songId || !rating) {
            return NextResponse.json({ message: "Song Id or Rating not provided", success: false, status: 400 });
        }

        await connectDB();
        const db = mongoose.connection.useDb("lyrics_meanings");
        const ratingCollection: Collection = db.collection('ratings');
        const songsCollection: Collection = db.collection('songs');

        const existingSessionId = req.cookies.get('sessionId').value;

        const currentDate = new Date().toISOString().split('T')[0];

        const concatenatedString = `${existingSessionId}${songId}${currentDate}`;
        const sha256Hash = createHash('sha256').update(concatenatedString).digest('hex');

        const song = await songsCollection.findOne({ slug: slug });
        if (!song) {
            return new NextResponse("Song not found", { status: 404 });
        }

        const existingRating = await ratingCollection.findOne({ hash: sha256Hash, song_id: parseInt(songId, 10) });

        if (existingRating) {

            if (existingRating.rating === rating) {
                await ratingCollection.deleteOne({ hash: sha256Hash });

                const newRatingCount = song.ratings_count - 1;
                const newRatingValue = newRatingCount > 0
                    ? parseFloat((((song.ratings_count * song.rating) - existingRating.rating) / newRatingCount).toFixed(1))
                    : 0;

                const data = await songsCollection.findOneAndUpdate(
                    { _id: song._id },
                    { $set: { ratings_count: newRatingCount, rating: newRatingValue } },
                    { returnDocument: 'after', projection: { ratings_count: 1, rating: 1 } }
                );

                return NextResponse.json({
                    message: "Song Rating Deleted",
                    success: true,
                    status: 200,
                    data: data
                });
            }

            const prevRatingValue = existingRating.rating;
            const newRatingValue = parseFloat((((song.ratings_count * song.rating) - prevRatingValue + rating) / song.ratings_count).toFixed(1));

            await ratingCollection.findOneAndUpdate(
                { hash: sha256Hash },
                { $set: { rating: rating, datetime_added: currentDate } }, { returnDocument: 'after' }
            );

            const data = await songsCollection.findOneAndUpdate(
                { _id: song._id },
                { $set: { rating: newRatingValue } },
                { returnDocument: 'after', projection: { ratings_count: 1, rating: 1 } }
            );

            return NextResponse.json({
                message: "Song Rating Updated",
                success: true,
                status: 200,
                data: data
            });

        } else {
            const newRatingCount = song.ratings_count + 1;
            const newRatingValue = parseFloat((((song.ratings_count * song.rating) + rating) / newRatingCount).toFixed(1));

            await ratingCollection.insertOne({
                song_id: parseInt(songId, 10),
                hash: sha256Hash,
                rating: rating,
                datetime_added: currentDate,
            });

            const data = await songsCollection.findOneAndUpdate(
                { _id: song._id },
                { $set: { ratings_count: newRatingCount, rating: newRatingValue } },
                { returnDocument: 'after', projection: { ratings_count: 1, rating: 1 } }
            );


            return NextResponse.json({
                message: "Song Rating Added",
                success: true,
                status: 200,
                data: data
            });
        }
    } catch (err: any) {
        return new NextResponse(err, { status: 500 });
    }
};


export const GET = async (req: any) => {

    const url = new URL(req.url)
    const slug = url.searchParams.get("slug")

    if (!slug) {
        return NextResponse.json({ message: "Slug not provided", success: false, status: 400 });
    }

    try {
        await connectDB();
        const db = mongoose.connection.useDb("lyrics_meanings");
        const songsCollection: Collection = db.collection('songs');

        const data = await songsCollection.aggregate([
            { $match: { slug: slug } },
            { $project: { rating: 1, ratings_count: 1 } }]).next();

        return NextResponse.json({ message: "Successful", success: true, status: 200, data: data });

    } catch (err: any) {
        return new NextResponse(err, { status: 500 })
    }
}