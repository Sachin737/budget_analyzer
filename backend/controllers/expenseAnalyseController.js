const ExpenseAnalyse = require('./../models/expenseAnalyseModel');
const AppError = require('../utils/appError');
const catchAsync = require('./../utils/catchAsync');

exports.getAllExpenseDetails = catchAsync(async (req, res, next) => {
    const expenses = await ExpenseAnalyse.find();
    res.status(200).json({
        status: 'success',
        results: expenses.length,
        data: {
            expenses: expenses,
        },
    });
});

exports.addOrUpdateExpenseDetail = catchAsync(async (req, res, next) => {
    let expense = await ExpenseAnalyse.findOneAndUpdate(
        { user: req.body.user, item: req.body.item },
        preprocessVals(req.body)
    );
    console.log(req.body);
    if (!expense) {
        expense = await ExpenseAnalyse.create(preprocessVals(req.body));
    }
    // Update summary for the current user
    req.params.user = req.body.user;

    res.status(201).json({
        status: 'success',
        data: {
            expense,
        },
    });
});

exports.addExpenseDetail = catchAsync(async (req, res, next) => {
    const expense = await ExpenseAnalyse.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            expense,
        },
    });
});

exports.getExpenseDetail = catchAsync(async (req, res, next) => {
    const expense = await ExpenseAnalyse.findById(req.params.id);
    res.status(200).json({
        status: 'success',
        data: {
            expense,
        },
    });
});

exports.updateExpenseDetail = catchAsync(async (req, res, next) => {
    const expense = await ExpenseAnalyse.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );

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
    const expense = await ExpenseAnalyse.findByIdAndDelete(req.params.id);

    if (!expense) {
        return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
});
