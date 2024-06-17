const express = require('express');
const InflationController = require('./../controllers/InflationController');

const router = express.Router();

router
    .route('/')
    .get(InflationController.getInflationData)

module.exports = router;
