const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email Field Is Required']
    },
    password: {
        type: String,
        required: [true, 'Password Field Is Required'],
        minlength: [6, 'atleast 6 characters required']
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;