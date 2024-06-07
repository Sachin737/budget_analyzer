const axios = require('axios');
const fs = require('fs');
const tabula = require('fresh-tabula-js');

// Read the PDF file
axios.get("https://eaindustry.nic.in/pdf_files/cmonthly.pdf", { responseType: 'arraybuffer' })
    .then(response => {
        // Define column names
        const columns = ['Commodity', 'Rate of Inflation'];

        // Extract the desired columns
        const dfs = tabula.extractRawTables(response.data, { pages: '3' });
        const df = dfs[0].filter(row => row['Unnamed: 0'] !== undefined).map(row => ({
            'Commodity': row['Unnamed: 0'],
            'Rate of Inflation': row['Rate of Inflation']
        }));

        // Remove the first 8 rowss
        const dfTrimmed = df.slice(7);

        // Handle NaN values in the first column
        const newRows = [];
        let skipNext = false;

        dfTrimmed.forEach((row, index) => {
            const commodity = row['Commodity'];
            const inflation = row['Rate of Inflation'];

            if (skipNext) {
                skipNext = false;
                return;
            }

            if (!commodity) {
                if (index + 1 < dfTrimmed.length) {
                    newRows[newRows.length - 1]['Commodity'] += " " + dfTrimmed[index + 1]['Commodity'];
                }
                newRows[newRows.length - 1]['Rate of Inflation'] = inflation.split(" ")[1];
                skipNext = true;
            } else {
                if (inflation !== undefined) {
                    newRows.push({ 'Commodity': commodity, 'Rate of Inflation': inflation.split(" ")[1] });
                } else {
                    newRows.push({ 'Commodity': commodity, 'Rate of Inflation': inflation });
                }
            }
        });

        // Display the modified data
        console.log(newRows);

        // Save the modified DataFrame to a CSV file
        const csvData = newRows.map(row => `${row['Commodity']},${row['Rate of Inflation']}`).join('\n');
        fs.writeFileSync('wpi_data.csv', csvData);
    })
    .catch(error => {
        console.error('Error:', error);
    });
