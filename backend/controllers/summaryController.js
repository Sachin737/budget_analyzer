const Summary = require('./../models/summaryModel');
const Expense = require('./../models/expenseModel');
const AppError = require('../utils/appError');

function sumUserExpenseByType(expenses) {
    return expenses.reduce((acc, curr) => {
        if (curr.typeOfExpense === 'family-direct') {
            acc[curr.item] = curr.monthly;
            return acc;
        }
        if (!acc[curr.typeOfExpense]) {
            acc[curr.typeOfExpense] = 0;
        }

        acc[curr.typeOfExpense] += curr.monthly;
        return acc;
    }, {});
}

function preprocessKeys(obj) {
    const newObj = {};

    for (const key in obj) {
        const newKey = key == 'bill' ? 'subscription' : key.replace(/-/g, '_');

        newObj[newKey] = obj[key];
    }
    return newObj;
}

exports.createUserSummary = async (req, res, next) => {
    try {
        const expenses = await Expense.find({ user: req.params.user });
        const groupedExpenses = preprocessKeys(sumUserExpenseByType(expenses));

        const summary = await Summary.create({
            ...groupedExpenses,
            user: req.params.user,
        });

        res.status(200).json({
            status: 'success',
            data: {
                summary,
            },
        });
    } catch (err) {
        next(err);
    }
};

exports.getAllSummaryDetails = async (req, res, next) => {
    try {
        const summaries = await Summary.find();
        res.status(200).json({
            status: 'success',
            results: summaries.length,
            data: {
                summaries,
            },
        });
    } catch (err) {
        next(err);
    }
};

exports.addSummaryDetail = async (req, res, next) => {
    try {
        const summary = await Summary.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                summary,
            },
        });
    } catch (err) {
        next(err);
    }
};

exports.getSummaryDetail = async (req, res, next) => {
    try {
        const summary = await Summary.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                summary,
            },
        });
    } catch (err) {
        next(err);
    }
};

exports.updateSummaryDetail = async (req, res, next) => {
    try {
        const summary = await Summary.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!summary) {
            return next(new AppError('No document found with that ID', 404));
        }

        res.status(200).json({
            status: 'success',
            data: {
                summary,
            },
        });
    } catch (err) {
        next(err);
    }
};

exports.deleteSummaryDetail = async (req, res, next) => {
    try {
        const summary = await Summary.findByIdAndDelete(req.params.id);

        if (!summary) {
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
