let router = require('express').Router()
let jwt = require('jsonwebtoken')
let { hash, compare } = require('bcryptjs')
let { User } = require('../models/user')


// handles log in and sends an jwt token
router.post('/login', async(req, res) => {
	let { username = '', password = '' } = req.body
	let user = await User.findOne({ username }).exec()
	let token = ''
	// if (err)
	// 	return res.status(500).json()
	// else if (!user) return res.status(401).json()
	
	compare(password, user.password, (e, r) => {
		if (e) return res.status(500).json()
		else if (!r) return res.status(401).json()

		user.password = undefined
		token = jwt.sign({
			sub: 'movies',
			iss: process.env.HOST,
			exp: Math.floor(Date.now() / 1000 + 10 * 60*10),

			user,
			alg: 'HS256'
		}, process.env.AUTH_SECRET)
		res.set({ 'access-token': token, 'Access-Control-Expose-Headers': 'access-token' })
		res.json({"message":"user authenticated"})
		res.end()
	})

})
// handles sign up
router.post("/sign-up", async (req, res) => {
	try {
		// Extract email and password from the req.body object
		const { email, password, firstName, lastName, username } = req.body;

		// Check if the email is already in use
		let userExists = await User.findOne({ email });

		if (userExists) {
			return res.status(401).json({ message: "Email is already in use." });
			
		}

		// Define salt rounds
		const saltRounds = 10;

		// Hash password
		hash(password, saltRounds, (err, hash) => {
			if (err) throw new Error("Internal Server Error");

			// Create a new user
			let user = new User({
				email,
				password: hash,
				firstName,
				lastName,
				username
			});

			// Save user to database
			user.save().then(() => {
				return res.status(200).json({ message: "User created successfully", user });
			});
		});
	} catch (err) {
		return res.status(401).send(err.message);
	}
});


module.exports = router
