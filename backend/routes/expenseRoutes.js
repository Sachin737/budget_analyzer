const express = require('express');
const expenseController = require('./../controllers/expenseController');
const { protect } = require("../controllers/authController");

const router = express.Router();

router
    .route('/')
    .get(protect, expenseController.getAllExpenseDetails)
    .post(protect, expenseController.addOrUpdateExpenseDetail);

router
    .route('/:id')
    .get(protect, expenseController.getExpenseDetail)
    .patch(protect, expenseController.updateExpenseDetail)
    .delete(protect, expenseController.deleteExpenseDetail);

module.exports = router;
