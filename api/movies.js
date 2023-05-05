let router = require('express').Router()
let {RatedMovie} = require('../models/ratedMovies')
let {Rating} = require('../models/rating')
let {Review} = require('../models/review')

// Add new movie
router.post('/', async(req,res)=>
{
    console.log(req.body)
    let movie = new RatedMovie(req.body)
    try
    {
        await movie.save();
        res.json(movie);
        console.log("Done");
    }catch{
        res.status(400).json("oops something went wrong");
    }
})
//gets a movie by id
router.get('/:id', async ({params: {id}}, res) => {
    try {
        console.log(id);

        // Execute all queries in parallel
        const [movie, reviews, ratings] = await Promise.all([
            RatedMovie.findById(id).exec(),
            Review.find({movieId: id}).exec(),
            Rating.aggregate([
                {$match: {movieId: id}},
                {$group: {_id: null, avgRating: {$avg: "$rating"}}},
            ]).exec(),
        ]);

        // Extract the average rating from the aggregation result
        const avgScore = ratings.length > 0 ? ratings[0].avgRating : 0;

        // Send the response as a streaming response
        res.setHeader('Content-Type', 'application/json');
        res.write('{"movie":');
        res.write(JSON.stringify(movie));
        res.write(',"rating":');
        res.write(JSON.stringify(avgScore));
        res.write(',"reviews":[');
        let isFirstReview = true;
        for await (const review of reviews) {
            if (!isFirstReview) {
                res.write(',');
            }
            res.write(JSON.stringify(review));
            isFirstReview = false;
        }
        res.write(']}');
        res.end();
        
        console.log("Done");
    } catch {
        res.status(400).json("oops something went wrong");
    }
});



//Add a rating to the movie
/*
    DATA SHOULD LOOK LIKE THIS
    {
    "user":"user id",
    "movieId":"643daf9ef887703edd1ef449",
    "rating": 4.5
    }
*/
router.post('/rate',async(req,res)=>
{
    if(!isAuthed(req,res))
    {
        res.status().json({"message":"user not authenticated"})
    }
    console.log(req.body)
    let rating = new Rating(req.body)
    try
    {
        await rating.save();
        res.json(rating)
        console.log("Done")
    }catch{
        res.status(400).json("oops something went wrong");
    }
})

router.post('/review',async(req,res)=>
{
    if(!isAuthed(req,res))
    {
        res.status().json({"message":"user not authenticated"})
    }
    console.log(req.body)
    let review = new Review(req.body)
    try
    {
        await review.save();
        res.json(review)
        console.log("Done")
    }catch(err){
        
        res.status(400).json("oops something went wrong\n"+err);
    }
})

// Gets a rated movie along with its ratings and reviews

module.exports=router