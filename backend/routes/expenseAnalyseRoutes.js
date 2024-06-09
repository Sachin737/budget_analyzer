const express = require('express');
const expenseAnalyseController = require('./../controllers/expenseAnalyseController');
const { protect } = require('../controllers/authController');

const router = express.Router();

router
    .route('/')
    .get(protect, expenseAnalyseController.getAllExpenseDetails)
    .post(protect, expenseAnalyseController.addOrUpdateExpenseDetail);

router
    .route('/:id')
    .get(protect, expenseAnalyseController.getExpenseDetail)
    .patch(protect, expenseAnalyseController.updateExpenseDetail)
    .delete(protect, expenseAnalyseController.deleteExpenseDetail);

module.exports = router;
