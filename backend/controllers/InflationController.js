const catchAsync = require('./../utils/catchAsync');
const fs = require("fs");
const csvParser = require("csv-parser");
const path = require('path');


exports.getInflationData = catchAsync(async (req, res) => {
    // Step 1: Read CSV data
    const results = {};

    fs.createReadStream(path.join(__dirname, '../wpi_data.csv'))
        .pipe(csvParser())
        .on('data', (row) => {
            results[row['Commodity']] = parseFloat(row['Rate of Inflation']);
        })
        .on('end', async () => {
            res.status(200).json({
                status: 'success',
                data: {
                    inflationData: results,
                }
            });
        });
});
