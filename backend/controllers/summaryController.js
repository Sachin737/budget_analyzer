const Summary = require('./../models/summaryModel');
const { userSummary } = require('./../controllers/userSummaryController');
const AppError = require('../utils/appError');
const catchAsync = require('./../utils/catchAsync');

exports.createUserSummary = catchAsync(async (req, res, next) => {
    const summary = await userSummary(req, res, next);

    res.status(200).json({
        status: 'success',
        data: {
            summary,
        },
    });
});

exports.getAllSummaryDetails = catchAsync(async (req, res, next) => {
    const summaries = await Summary.find({ user: req.user?.id });
    res.status(200).json({
        status: 'success',
        results: summaries.length,
        data: {
            summaries,
        },
    });
});

exports.addSummaryDetail = catchAsync(async (req, res, next) => {
    const summary = await Summary.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            summary,
        },
    });
});

exports.getSummaryDetail = catchAsync(async (req, res, next) => {
    const summary = await Summary.findById(req.params.id);
    res.status(200).json({
        status: 'success',
        data: {
            summary,
        },
    });
});

exports.updateSummaryDetail = catchAsync(async (req, res, next) => {
    const summary = await Summary.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!summary) {
        return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            summary,
        },
    });
});

exports.deleteSummaryDetail = catchAsync(async (req, res, next) => {
    const summary = await Summary.findByIdAndDelete(req.params.id);

    if (!summary) {
        return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
});
