/*
FIELD
MOVIE
RATING
REVIEWS
*/
const { default: mongoose } = require("mongoose");

let schema = new mongoose.Schema(
    {
        movie:{
            type:String,
            required:true
        }
    }
)

let RatedMovie = mongoose.model('RatedMovie',schema)
module.exports = {
    RatedMovie
}