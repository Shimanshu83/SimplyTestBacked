var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./modules/route.js');
const cors = require('cors');

var app = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', indexRouter);

app.all('*', async (req, res, next) => {
    try {
        // throw new NotFoundError() 
        // throw not found error.
    } catch (error) {
        next(error)
    }
})


module.exports = app;
