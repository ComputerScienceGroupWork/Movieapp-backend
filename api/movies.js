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
router.get('/:id',async({params:{id}},res)=>
{
    try
    {
        console.log(id)
        let movie = await RatedMovie.findById(id).exec()
        res.json(movie);
        console.log("Done");
    }catch{
        res.status(400).json("oops something went wrong");
    }
})


//Add a rating to the movie
/*
    DATA SHOULD LOOK LIKE THIS
    {
    "user":"user id",
    "movieId":"643daf9ef887703edd1ef449",
    "rating": 4.5
    }
*/
router.post('/review',async(req,res)=>
{
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

// Gets a rated movie along with its ratings and reviews

module.exports=router