const mongoose = require('mongoose');

const summarySchema = new mongoose.Schema(
    {
        household: {
            type: Number,
            default: 0,
        },
        shopping: {
            type: Number,
            default: 0,
        },
        house_help: {
            type: Number,
            default: 0,
        },
        subscription: {
            type: Number,
            default: 0,
        },
        miscellaneous_expenses: {
            type: Number,
            default: 0,
        },
        donation_charity: {
            type: Number,
            default: 0,
        },
        medical_expenses: {
            type: Number,
            default: 0,
        },
        towards_gifts: {
            type: Number,
            default: 0,
        },
        pocket_money: {
            type: Number,
            default: 0,
        },
        vacation: {
            type: Number,
            default: 0,
        },
        travel: {
            type: Number,
            default: 0,
        },
        vehicle: {
            type: Number,
            default: 0,
        },
        lifestyle: {
            type: Number,
            default: 0,
        },
        kid_s_study: {
            type: Number,
            default: 0,
        },
        insurance_payments: {
            type: Number,
            default: 0,
        },
        investment_outflows: {
            type: Number,
            default: 0,
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            unique: true,
            required: [true, 'Expense summary must belong to an user.'],
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }, // helps display virtual fields into the json and object
    }
);

const Summary = mongoose.model('Summary', summarySchema);

module.exports = Summary;
