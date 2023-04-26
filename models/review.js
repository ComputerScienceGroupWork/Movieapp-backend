/*
 Fields
 USER
 MOVIE
 CONTENT
*/

const { default: mongoose } = require("mongoose");

let schema = new mongoose.Schema(
    {
        user:{
            type:String,
            required:true
        },
        movieId:
        {
            type:String,
            required:true
        },
        content:
        {
            type:String,
            required:true
        }
    }
)

let Review = mongoose.model('Review',schema)
module.exports=
{
    Review
}