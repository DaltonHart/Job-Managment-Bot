const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    user: { type: String, },
    description: { type: String, },
	complete: Boolean,
	dueTime: { type : Date, default: () => Date.now() }
})

module.exports = mongoose.model('User', userSchema)