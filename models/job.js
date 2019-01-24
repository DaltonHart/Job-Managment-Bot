const mongoose = require('mongoose');

const JobSchema = mongoose.Schema({
    user: { type: String, },
    description: { type: String, },
	complete: Boolean,
    dueTime: { type : Date, },
    _id: Number,
    disabled: { type:Boolean, default: false}
})

module.exports = mongoose.model('Job', JobSchema)