let router = require('express').Router()
let { RatedMovie } = require('../models/ratedMovies')
let { Rating } = require('../models/rating')
let { Review } = require('../models/review')
//let { isAuthed } = require('./authChecker')
// Add new movie
router.post('/', async (req, res) => {
    if (!isAuthed(req.headers.authorization.split(' ')[1], res)) {
        res.status(400).json({ "message": "user not authenticated" })
        res.end()
    }
    console.log(req.body)
    let movie = new RatedMovie(req.body)
    try {
        await movie.save();
        res.json(movie);
        console.log("Done");
    } catch {
        res.status(400).json("oops something went wrong");
    }
})
//gets a movie by id
router.get('/:id', async (req, res) => {
    console.log(req.params.id)
    let id = req.params.id
    if (!isAuthed(req.headers.authorization.split(' ')[1], res)) {
        res.status(400).json({ "message": "user not authenticated" })
        res.end()
    }
    else {
        try {
            console.log(id);

            // Execute all queries in parallel
            const [movie, reviews, ratings] = await Promise.all([
                RatedMovie.findById(id).exec(),
                Review.find({movieId:id }).exec(),
                Rating.aggregate([
                    { $match: { movieId: id } },
                    { $group: { _id: null, avgRating: { $avg: "$rating" } } },
                ]).exec(),
            ]);
            //let avgScore = 0;
            // let ratings = await Rating.find({movieId:id}).exec()
            // let sum = 0;
            // ratings.forEach(element => {
            //     sum += element.rating;
            // });
           // avgScore = sum/ratings.length
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
router.post('/rate', async (req, res) => {

    if (!isAuthed(req.headers.authorization.split(' ')[1], res)) {
        res.status(400).json({ "message": "user not authenticated" })
        res.end()
    } else {
        if (!RatedMovie.exists({ movie: req.body.movieId })) {
            let movie = new RatedMovie(req.body)
            try {
                await movie.save();
                res.json(movie);
                console.log("Movie did not exist so was added");
            } catch {
                res.status(400).json("oops something went wrong");
            }
        }
        console.log(req.body)
        let rating = new Rating(req.body)
        try {
            await rating.save();
            res.json(rating)
            console.log("Done")
        } catch {
            res.status(400).json("oops something went wrong");
        }
    }
})

router.post('/review', async (req, res) => {
    if (!isAuthed(req.headers.authorization.split(' ')[1], res)) {
        res.status(400).json({ "message": "user not authenticated" })
        res.end()
    } else {
        if (!RatedMovie.exists({ movie: req.body.movieId })) {
            let movie = new RatedMovie(req.body)
            try {
                await movie.save();
                res.json(movie);
                console.log("Movie did not exist so was added");
            } catch {
                res.status(400).json("oops something went wrong");
            }
        }

        console.log(req.body)
        let review = new Review(req.body)
        try {
            await review.save();
            res.json(review)
            console.log("Done")
        } catch (err) {

            res.status(400).json("oops something went wrong\n" + err);
        }
    }

})

async function addMovie(id, res, req) {
    let movie = new RatedMovie(req.body)
    try {
        await movie.save();
        res.json(movie);
        console.log("Done");
    } catch {
        res.status(400).json("oops something went wrong");
    }
}


require('dotenv').config() // Load variables from a .env file
let express = require('express')

let jwt = require('jsonwebtoken')

function isAuthed(req, res) {
 
    const token = req;
    console.log(req)
    //Authorization: 'Bearer TOKEN'
    if (!token) {
        return false
        //res.status(200).json({ success: false, message: "Error! Token was not provided." });
    }
    //Decoding the token
    try {
        const decodedToken = jwt.verify(token, process.env.AUTH_SECRET);
        //res.status(200).json({ success: true, data: { user: decodedToken.user, email: decodedToken.email } });
        return true;
    } catch {
        return false;
        //res.status(404).json({ "message": "Not authenticated" })
    }
}

// Gets a rated movie along with its ratings and reviews

module.exports = router