let router = require('express').Router()
require('dotenv').config()
let { RatedMovie } = require('../models/ratedMovies')
let { Rating } = require('../models/rating')
let { Review } = require('../models/review')
const { User } = require('../models/user');
const http = require('http')
//let { isAuthed } = require('./authChecker')
// Add new movie
router.post('/', async (req, res) => {
    if (!isAuthed(req.headers.authorization.split(' ')[1], res)) {
        return res.status(400).json({ "message": "user not authenticated" })
        //res.end()
    }

	let c = await RatedMovie.findOne({movie:req.body.movie})
	//if(error){console.log(error)}
	if (c) {
	console.log("found something");
	//console.log(c);
	return res.status(200).json(c)}
	
	//if (!RatedMovie.exists(req.body)) {

		console.log(req.body)
		let movie = new RatedMovie(req.body)
		try {
			await movie.save();
			console.log("Done");
			return res.json(movie);
		} catch {
			return res.status(400).json("oops something went wrong");
		}
	/* }
	//please work
	console.log("Movie already added")
	let movie =  RatedMovie.findOne(req.body).exec()
	return res.status(200).json(movie)*/
})
//gets a movie by id



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
        return res.status(400).json({ "message": "user not authenticated" })
       // res.end()
    } else {
        /*if (!RatedMovie.exists({ movie: req.body.movieId})) {
            let movie = new RatedMovie({movie: req.body.movieId})
            try {
                movie.save();
                console.log("Movie did not exist so was added");
                return  res.json(movie);
            } catch {
                return res.status(400).json("oops something went wrong");
            }
        }*/
        console.log(req.body)
        let rating = new Rating(req.body)
        try {
            await rating.save();
            console.log("Done")
            return  res.json(rating)
        } catch {
            return res.status(400).json("oops something went wrong");
        }
    }
})

router.get('/recommend', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]; 
    if (!isAuthed(token, res)) {
        return res.status(400).json({ "message": "user not authenticated" })
        //res.end()
    } else {
		// if (!user) {
        //     res.status(404).json({ message: 'User not found' });
        //     res.end()
        // }
        const decodedToken = jwt.verify(token,process.env.AUTH_SECRET );
        userWatchlist = decodedToken.user.watchlist
        
		for(let i = 0; i < userWatchlist.length && i < 5;i++)
		{
			console.log(userWatchlist[i]);
		}
		return res.status(200).json({ watchlist: userWatchlist })

	}
    //res.end()
    //res.status(200).json({"Msg":"this works"})


})

router.post('/review', async (req, res) => {
    if (!isAuthed(req.headers.authorization.split(' ')[1], res)) {
        return res.status(400).json({ "message": "user not authenticated" })
      //  res.end()
    } else {
        /*if (!RatedMovie.exists({ movie: req.body.movieId })) {
            let movie = new RatedMovie({movie: req.body.movieId})
            try {
                await movie.save();
                console.log("Movie did not exist so was added");
                return  res.json(movie);
            } catch {
                return res.status(400).json("oops something went wrong");
            }
        }*/

        console.log(req.body)
        let review = new Review(req.body)
        try {
            await review.save();
            console.log("Done")
            return res.json(review)
        } catch (err) {

            return res.status(400).json("oops something went wrong\n" + err);
        }
    }

})
// router.get('/:id/reviews', async(req, req) =>
// {

// })
router.get('/:id', async (req, res) => {
    console.log(req.params.id)
    let id = req.params.id
    if (!isAuthed(req.headers.authorization.split(' ')[1], res)) {
        return res.status(400).json({ "message": "user not authenticated" })
        //res.end()
    }
    else {
        try {
            console.log(id);

            // Execute all queries in parallel
            // const [/*movie,*/ reviews, ratings] = await Promise.all([
            //     //RatedMovie.findOne({movie: }).exec(),
            //     Review.find({ movieId: id }).exec(),
                // Rating.aggregate([
                //     { $match: { movieId: id } },
                //     { $group: { _id: null, avgRating: { $avg: "$rating" } } },
                // ]).exec(),
            // ]);
            ratings =await Rating.aggregate([
                { $match: { movieId: id } },
                { $group: { _id: null, avgRating: { $avg: "$rating" } } },
            ]).exec();
            //let avgScore = 0;
            // let ratings = await Rating.find({movieId:id}).exec()
            // let sum = 0;
            // ratings.forEach(element => {
            //     sum += element.rating;
            // });
            // avgScore = sum/ratings.length
            // Extract the average rating from the aggregation result
    
            const avgScore = ratings.length > 0 ? ratings[0].avgRating : 0;

            console.log("Done");

            return res.status(200).json({rating:avgScore,reviews: await Review.find({ movieId: id }).exec()})
        } catch {
            return  res.status(400).json("oops something went wrong");
        }
    }
});

// async function addMovie(id, res, req) {
//     let movie = new RatedMovie(req.body)
//     try {
//         await movie.save();
//         res.json(movie);
//         console.log("Done");
//     } catch {
//         res.status(400).json("oops something went wrong");
//     }
// }



//require('dotenv').config() // Load variables from a .env file
//let express = require('express')

let jwt = require('jsonwebtoken')

function isAuthed(req, res) {

    const token = req;
    //console.log(req)
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
