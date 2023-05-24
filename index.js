require('dotenv').config() // Load variables from a .env file
let express = require('express')
let mongoose = require('mongoose')
let cors = require('cors')
let { join } = require('path')
let http = require('https')
let jwt = require('jsonwebtoken')
let app = express()

 // Make configuration in the env file
app.use(cors())

mongoose.connect(process.env.DB_URI)

mongoose.connection.on('connected', _ => {
	console.log('connection estalished to database')
})

app.use(express.json({ extended: true }))

app.use('/api', require('./api'))

// THis is a test of accessing components only when logged in
app.get('/getuser', (req, res)=>{  
    const token = req.headers.authorization.split(' ')[1]; 
    //Authorization: 'Bearer TOKEN'
    if(!token)
    {
        res.status(200).json({success:false, message: "Error! Token was not provided."});
    }
    //Decoding the token
    try{
    const decodedToken = jwt.verify(token,process.env.AUTH_SECRET );
    res.status(200).json({success:true, data: {user:decodedToken.user, email:decodedToken.email}});   
    }catch{
        res.status(404).json({"message":"Not authenticated"})
    }
})
app.use(express.static(join(__dirname, 'public')))



// app.get("/movies", (req, res) => {

// 	http.get(`https://api.themoviedb.org/3/movie/550?api_key=${process.env.api_key}`, (res) => {
// 		console.log(`statusCode: ${res.statusCode}`);
// 		res.on('data', (d) => {
			
// 			process.stdout.write(d);
// 		});
// 	}).on('error', (e) => {
// 		console.error(e);
// 	});
// })


app.use('*', (req, res) => {
	res.sendFile(join(__dirname, 'public', 'app', 'index.html'))
})

app.listen(process.env.PORT, _ => {
	console.log(`server listening on http://${process.env.HOST}:${process.env.PORT}`)
})
