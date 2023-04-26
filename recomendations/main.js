
//None Generic
/*
    EXPECTED OBJECT TYPE
    {
        id:,
        length:,
        rating:,
        genras:,
    }
*/
function canRecommend(movie,data,midValue,seperatorKey,otherClassifiers = []) {
    upperBounds = data.filter((el)=>{return el[seperatorKey] >= midValue})
    lowerBounds = data.filter((el)=>{return el[seperatorKey] < midValue})

    var movieLength = movie.length;
    
    // calculate an average movie length
    var upperBoundsAvgLength = 0;
    upperBounds.forEach(element => {
        upperBoundsAvgLength += element.length;
    });
    upperBoundsAvgLength /= upperBounds.length;

    var lowerBoundsAvgLength = 0;
    lowerBounds.forEach(element => {
        lowerBoundsAvgLength += element.length;
    });
    lowerBoundsAvgLength /= lowerBounds.length;


}