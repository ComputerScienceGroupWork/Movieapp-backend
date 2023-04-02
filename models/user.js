let mongoose = require('mongoose')

let schema = new mongoose.Schema({
	firstName:{
		type:String,
		required:true,
		pattern:/^\w+$/,
	},

	lastName:{
		type: String,
		required: true,
		pattern:/^\w+$/
	},

	username:{
		type:String,
		required:true,
		pattern:/[\w\d]+/
	},

	password:{
		type:String,
		required:true
	},

	role:{
		type:String,
		enum:['match-secretary','match-commissioner'],
		required:true
	},
	createdAt:{
		type:Date,
		required:true,
		default: new Date()
	}
});



let User = mongoose.model('User',schema)


module.exports = {
	User
}
