const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
    {
        typeOfExpense: {
            type: String,
            required: [true, 'An expense must have associated type'],
            enum: {
                values: [
                    'household',
                    'shopping',
                    'house-help',
                    'bill',
                    'family-direct',
                    'vacation',
                    'travel',
                    'vehicle',
                    'lifestyle',
                    'kid_s-study',
                    'insurance-payments',
                    'investment-outflows',
                ],
                message: 'type of expense is not defined!',
            },
        },
        item: {
            type: String,
            required: [true, 'Item cannot be empty!'],
        },
        monthly: {
            type: Number,
            default: 0,
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Expense must belong to an user.'],
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }, // helps display virtual fields into the json and object
    }
);

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
