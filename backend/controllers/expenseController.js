const Expense = require('./../models/expenseModel');
const { userSummary } = require('./../controllers/userSummaryController');
const AppError = require('../utils/appError');

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

exports.addOrUpdateExpenseDetail = async (req, res, next) => {
    try {
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
    } catch (err) {
        next(err);
    }
};

exports.addExpenseDetail = async (req, res, next) => {
    try {
        const expense = await Expense.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                expense,
            },
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
