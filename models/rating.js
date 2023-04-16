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
        movie:{
            type:String,
            required:true
        },
        rating:{
            type:Int,
            default: 0,
        }
    }
)

let Rating = mongoose.model("Rating",schema)
module.exports={
    Rating
}