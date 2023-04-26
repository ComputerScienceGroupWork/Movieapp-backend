let mongoose = require('mongoose')

let schema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true,
		pattern: /^\w+$/,
	},

	lastName: {
		type: String,
		required: true,
		pattern: /^\w+$/
	},

	username: {
		type: String,
		required: true,
		pattern: /[\w\d]+/
	},
	email: {
		type: String,
		required: [true, 'Email is required'],
		// validate: {
		// 	validator: isEmail,
		// 	message: props => `${props.value} is not a valid email`
		// }
	},
	password: {
		type: String,
		required: [true, 'Password is required'],
		validate: {
			validator: function (value) {
				return value.length >= 8
			},
			message: () => 'Password must be at least eight characters long'
		}
	},

	createdAt: {
		type: Date,
		required: true,
		default: new Date()
	}
});



let User = mongoose.model('User', schema)


module.exports = {
	User
}
