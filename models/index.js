const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/vagrantbot');


module.exports = {
    Job : require('./job'),
}