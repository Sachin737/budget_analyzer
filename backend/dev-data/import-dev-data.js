const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./../models/userModel');
const Expense = require('./../models/expenseModel');
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE?.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose.set('strictQuery', true); // suppress warnings

mongoose.connect(DB).then((con) => {
    console.log('DB connection successful!');
});

// READ JSON FILE
const fileNames = [
    'expense-family-discretionary.txt',
    'expense-insurance.txt',
    'expense-investment-outflows.txt',
    'expense-kids-school.txt',
    'expense-lifestyle.txt',
    'expense-travel.txt',
    'expense-vacation.txt',
    'expense-vehicle.txt',
    'expenses-bills.txt',
    'expenses-household.txt',
    'expenses-shopping.txt',
    'expensses-household-help.txt',
];

const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));

let allExpenses = [];

fileNames.forEach((fileName) => {
    const fileContent = fs.readFileSync(`${__dirname}/${fileName}`, 'utf-8');
    const expenses = JSON.parse(fileContent);
    allExpenses.push(...expenses);
});

// IMPORT DATA INTO DB
const importData = async () => {
    try {
        await User.create(users);
        console.log('Data successfully loaded!');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

const importExpenseData = async () => {
    try {
        // console.log(allExpenses[0]);
        console.log(allExpenses.length);
        await Expense.create(allExpenses);
        console.log('Expense data loaded successfully!');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
    try {
        await User.deleteMany();
        console.log('Data successfully deleted!');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

if (process.argv[2] === '--import:user') {
    importData();
} else if (process.argv[2] === '--import:expense') {
    importExpenseData();
} else if (process.argv[2] === '--delete') {
    // deleteData();
    console.log("It's very risky I won't allow it");
    process.exit();
}
