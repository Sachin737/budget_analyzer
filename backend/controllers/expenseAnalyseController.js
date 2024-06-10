const ExpenseAnalyse = require('./../models/expenseAnalyseModel');
const AppError = require('../utils/appError');
const catchAsync = require('./../utils/catchAsync');

exports.getAllExpenseDetails = catchAsync(async (req, res, next) => {
    // of current user
    console.log(req.user?.id);
    const expenses = await ExpenseAnalyse.find({ user: req.user?.id });
    res.status(200).json({
        status: 'success',
        results: expenses.length,
        data: {
            expenses: expenses,
        },
    });
});

exports.addOrUpdateExpenseDetail = catchAsync(async (req, res, next) => {
    let currDate = new Date();
    if (req.body.purchagedAt) {
        currDate = new Date(req.body.purchagedAt);
    }
    currDate.setUTCHours(0, 0, 0, 0);

    let expense = await ExpenseAnalyse.findOneAndUpdate(
        {
            user: req.user?.id,
            purchagedAt: currDate,
            commodityName: req.body?.commodityName,
        },
        {
            $inc: { cost: req.body.cost, noOfUnit: req.body.noOfUnit },
        },
        { new: true, useFindAndModify: false }
    );

    // console.log(req.body);

    if (!expense) {
        const actualExpense = {
            ...req.body,
            user: req.user?.id,
        };
        console.log(actualExpense);
        expense = await ExpenseAnalyse.create(actualExpense);
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
