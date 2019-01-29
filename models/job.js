const mongoose = require('mongoose');

const JobSchema = mongoose.Schema({
    user: { type: String, },
    description: { type: String, },
	complete: Boolean,
    dueTime: { type : Date, },
    assignedDate: {type: Date},
    _id: Number,
    disabled: { type:Boolean, default: false},
    assigner: { type: String, }
})

module.exports = mongoose.model('Job', JobSchema)