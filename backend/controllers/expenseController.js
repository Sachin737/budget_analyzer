const Expense = require('./../models/expenseModel');
const { userSummary } = require('./../controllers/userSummaryController');
const AppError = require('../utils/appError');
const catchAsync = require('./../utils/catchAsync');

function preprocessVals(obj) {
    const newObj = {};
    const familyItem = [
        'pocket-money',
        'towards-gifts',
        'medical-expenses',
        'donation-charity',
        'miscellaneous-expenses',
    ];

    if (familyItem.includes(obj.item)) {
        obj.typeOfExpense = 'family-direct';
    }

    for (const key in obj) {
        const newVal = obj[key] == 'subscription' ? 'bill' : obj[key];
        newObj[key] = newVal;
    }

    return newObj;
}

exports.getAllExpenseDetails = catchAsync(async (req, res, next) => {
    const expenses = await Expense.find();
    res.status(200).json({
        status: 'success',
        results: expenses.length,
        data: {
            expenses: expenses,
        },
    });
});

exports.addOrUpdateExpenseDetail = catchAsync(async (req, res, next) => {
    let expense = await Expense.findOneAndUpdate(
        { user: req.body.user, item: req.body.item },
        preprocessVals(req.body)
    );
    console.log(req.body);
    if (!expense) {
        expense = await Expense.create(preprocessVals(req.body));
    }
    // Update summary for the current user
    req.params.user = req.body.user;
    const summary = await userSummary(req, res, next);

    res.status(201).json({
        status: 'success',
        data: {
            expense,
        },
    });
});

exports.addExpenseDetail = catchAsync(async (req, res, next) => {
    const expense = await Expense.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            expense,
        },
    });
});

exports.getExpenseDetail = catchAsync(async (req, res, next) => {
    const expense = await Expense.findById(req.params.id);
    res.status(200).json({
        status: 'success',
        data: {
            expense,
        },
    });
});

exports.updateExpenseDetail = catchAsync(async (req, res, next) => {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!expense) {
        return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: expense,
        },
    });
});

exports.deleteExpenseDetail = catchAsync(async (req, res, next) => {
    const expense = await Expense.findByIdAndDelete(req.params.id);

    if (!expense) {
        return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
});
