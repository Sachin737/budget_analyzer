const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name!'],
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email'],
    },
    photo: {
        type: String,
        default: 'default.jpg',
    },
    salaryAfterTax: {
        type: Number,
        default: 0,
    },
    otherIncomes: {
        type: Number,
        default: 0,
    },
    pensionContributions: {
        type: Number,
        default: 0,
    },
    // password: {
    //     type: String,
    //     required: [true, 'Please provide a password'],
    //     minlength: 8,
    //     // select: false, // this will make sure that password is not visible in output
    // },
    // passwordConfirm: {
    //     type: String,
    //     required: [true, 'Please confirm your password'],
    //     validate: {
    //         // This only works on CREATE and SAVE!!! (not with update one)
    //         validator: function (el) {
    //             return el === this.password;
    //         },
    //         message: 'Passwords are not the same!',
    //     },
    // },
    // passwordChangedAt: Date,
    // passwordResetToken: String,
    // passwordResetExpires: Date,

    active: {
        type: Boolean,
        default: true,
        select: false,
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
