const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! 🥲😰 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

const app = require('./app');

const DB = process.env.DATABASE?.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose.set('strictQuery', true); // suppress warnings

mongoose.connect(DB).then((con) => {
    console.log('DB connection successful!');
});

// connecting local database
// mongoose.connect(process.env.DATABASE_LOCAL).then(() => console.log('Local DB connection successful!'));

const port = process.env.PORT || 3000;

const server = app.listen(port, '0.0.0.0', () => {
    console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
    console.log(err.name, err.message);
    console.log('UNHANDLED REJECTION! 🥲😰 Shutting down...');
    server.close(() => {
        process.exit(1);
    });
});
