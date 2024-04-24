const Expense = require('./../models/expenseModel');
const AppError = require('../utils/appError');

exports.getAllExpenseDetails = async (req, res, next) => {
    try {
        const expenses = await Expense.find();
        res.status(200).json({
            status: 'success',
            results: expenses.length,
            data: {
                expenses: expenses,
            },
        });
    } catch (err) {
        next(err);
    }
};

exports.addExpenseDetail = async (req, res, next) => {
    try {
        const expense = await Expense.create(req.body);

        res.status(201).json({
            status: 'success',
            data: expense
        });
    } catch (err) {
        next(err);
    }
};

exports.getExpenseDetail = async (req, res, next) => {
    try {
        const expense = await Expense.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                expense,
            },
        });
    } catch (err) {
        next(err);
    }
};

exports.updateExpenseDetail = async (req, res, next) => {
    try {
        const expense = await Expense.findByIdAndUpdate(
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
    } catch (err) {
        next(err);
    }
};

exports.deleteExpenseDetail = async (req, res, next) => {
    try {
        const expense = await Expense.findByIdAndDelete(req.params.id);

        if (!expense) {
            return next(new AppError('No document found with that ID', 404));
        }

        res.status(204).json({
            status: 'success',
            data: null,
        });
    } catch (err) {
        next(err);
    }
};
