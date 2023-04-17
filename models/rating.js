/*
FIELDS
USER
MOVIE
RATING
*/

const { default: mongoose } = require("mongoose")

let schema = new mongoose.Schema(
    {
        user:{
            type:String,
            required:true
        },
        movieId:{
            type:String,
            required:true
        },
        rating:{
            type:Number,
            default: 0,
        }
    }
)

let Rating = mongoose.model("Rating",schema)
module.exports={
    Rating
}