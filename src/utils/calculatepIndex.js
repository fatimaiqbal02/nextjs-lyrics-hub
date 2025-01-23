const calculatePopularityIndex = (views, likes, rating, lryicsCount, meaningUsefulCount) => {

    const viewsWeight = 0.5;
    const likesWeight = 0.2;
    const ratingWeight = 0.1;
    const lyricsCountWeight = 0.1;
    const meaningUsefulCountWeight = 0.1;

    const weightedViews = views * viewsWeight;
    const weightedLikes = likes * likesWeight;
    const weightedRating = rating * ratingWeight;
    const weightedLyricsCount = lryicsCount * lyricsCountWeight;
    const weightedMeaningUsefulCount = meaningUsefulCount * meaningUsefulCountWeight;
  
    const popularityIndex = weightedViews + weightedLikes + weightedRating + weightedLyricsCount + weightedMeaningUsefulCount;
  
    return Math.round(popularityIndex);
  };

export default calculatePopularityIndex