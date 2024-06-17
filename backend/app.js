const express = require('express');
const morgan = require('morgan'); // logs the requests
const cors = require('cors');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const expenseRouter = require('./routes/expenseRoutes');
const summaryRouter = require('./routes/summaryRoutes');
const ExpenseAnalyseRouter = require('./routes/expenseAnalyseRoutes');
const inflationData = require("./routes/InflationRoutes")

const app = express();

app.enable('trust proxy');

app.use(cors());
app.options('*', cors());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// MIDDLEWARES
app.use(express.json());
app.use(cookieParser());

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
app.use('/api/v1/actualExpenses', ExpenseAnalyseRouter);
app.use('/api/v1/data', inflationData);

// UNHANDLED ROUTES
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

// START SERVER
module.exports = app;
