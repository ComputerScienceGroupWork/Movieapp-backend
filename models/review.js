/*
 Fields
 USER
 MOVIE
 CONTENT
*/

const { default: mongoose } = require("mongoose");

let schema = new mongoose.Schema(
    {
        userId:{
            type:String,
            required:true
        },
        movie:
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