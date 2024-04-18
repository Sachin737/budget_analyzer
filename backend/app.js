const express = require('express');
const morgan = require('morgan'); // logs the requests

const userRouter = require('./routes/userRoutes');
const expenseRouter = require('./routes/expenseRoutes');

const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// MIDDLEWARES
app.use(express.json());

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

// ROUTES
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Hello from the server side!',
        app: 'Budget Analyzer',
    });
});

app.use('/api/v1/users', userRouter);
app.use('/api/v1/expenses', expenseRouter);

// UNHANDLED ROUTES
app.all('*', (req, res, next) => {
    console.log("Can't find on this server!");
    next();
});

// START SERVER
module.exports = app;
