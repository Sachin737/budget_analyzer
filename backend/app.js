const express = require('express');
const morgan = require('morgan'); // logs the requests
const cors = require('cors');

const userRouter = require('./routes/userRoutes');
const expenseRouter = require('./routes/expenseRoutes');
const summaryRouter = require('./routes/summaryRoutes');

const app = express();

app.enable('trust proxy');

app.use(cors());
app.options('*', cors());

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
app.use('/api/v1/summaries', summaryRouter);

// UNHANDLED ROUTES
app.all('*', (req, res, next) => {
    res.status(404).json({
        status: 'error',
        message: `Can't find ${req.originalUrl} on this server!`,
    });
    next();
});

// START SERVER
module.exports = app;
