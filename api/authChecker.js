require('dotenv').config() // Load variables from a .env file
let express = require('express')

let jwt = require('jsonwebtoken')

async function isAuthed(res, req) {
    console.log(req.headers)
    const token = req.headers.authorization.split(' ')[1];
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

module.exports.isAuthed = isAuthed