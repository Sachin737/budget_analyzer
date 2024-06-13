const mongoose = require('mongoose');

const expenseAnalyseSchema = new mongoose.Schema(
    {
        commodityName: {
            type: String,
            required: [true, 'A commodity or service must have a name.'],
        },
        noOfUnit: {
            type: Number,
            default: 1,
        },
        cost: {
            type: Number,
            required: [true, 'A commodity or service must have a price.'],
        },
        comments: {
            // whether the purchage was beneficial or not!
            type: String,
        },
        purchagedAt: {
            type: Date,
            default: Date.now,
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Expense must belong to an user.'],
        },
    },
    // { timestamps: true },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }, // helps display virtual fields into the json and object
    }
);

// pre-save middleware
expenseAnalyseSchema.pre('save', function (next) {
    if (!this.purchagedAt) {
        const currentDate = new Date();
        currentDate.setUTCHours(0, 0, 0, 0);
        this.purchagedAt = currentDate;
    } else {
        const parsedDate = new Date(this.purchagedAt);
        parsedDate.setUTCHours(0, 0, 0, 0);
        this.purchagedAt = parsedDate;
    }
    next();
});

const ExpenseAnalyse = mongoose.model('ExpenseAnalyse', expenseAnalyseSchema);

module.exports = ExpenseAnalyse;
