const Expense = require('./../models/expenseModel');
const Summary = require('./../models/summaryModel');

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

exports.userSummary = async (req, res, next) => {
    try {
        const expenses = await Expense.find({ user: req.params.user });
        const groupedExpenses = preprocessKeys(sumUserExpenseByType(expenses));

        let summary = await Summary.findOneAndUpdate(
            { user: req.params.user },
            groupedExpenses
        );

        if (!summary) {
            summary = await Summary.create({
                ...groupedExpenses,
                user: req.params.user,
            });
        }

        return summary;
    } catch (err) {
        next(err);
    }
};
