const express = require('express');
const expenseController = require('./../controllers/expenseController');

const router = express.Router();

router
    .route('/')
    .get(expenseController.getAllExpenseDetails)
    .post(expenseController.addExpenseDetail);

router
    .route('/:id')
    .get(expenseController.getExpenseDetail)
    .patch(expenseController.updateExpenseDetail)
    .delete(expenseController.deleteExpenseDetail);

module.exports = router;
