const express = require('express');
const summaryController = require('./../controllers/summaryController');

const router = express.Router();

router.route('/create/:user').get(summaryController.createUserSummary);

router
    .route('/')
    .get(summaryController.getAllSummaryDetails)
    .post(summaryController.addSummaryDetail);

router
    .route('/:id')
    .get(summaryController.getSummaryDetail)
    .patch(summaryController.updateSummaryDetail)
    .delete(summaryController.deleteSummaryDetail);

module.exports = router;
