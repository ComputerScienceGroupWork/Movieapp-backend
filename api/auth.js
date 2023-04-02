let router=require('express').Router()
let jwt=require('jsonwebtoken')
let { hash, compare}=require('bcryptjs')
let {User}=require('../models/user')

router.post('/login',(req,res)=>{
	let {username='',password=''}=req.body
	User.findOne({username},(err,user)=>{
		let token=''
		if(err)
			return res.status(500).json()
		else if(!user) return res.status(401).json()

		compare(password,user.password,(e,r)=>{
		if(e) return res.status(500).json()
		else if(!r) return res.status(401).json()

		 user.password = undefined
			token=jwt.sign({sub:'daz',
				iss:process.env.HOST,
				exp:Math.floor(Date.now()/1000+10*60),
				user,
				alg:'HS256'
			},process.env.AUTH_SECRET)
			res.set({'access-token':token,'Access-Control-Expose-Headers':'access-token'})
		res.end()
	})
})
})
module.exports=router
