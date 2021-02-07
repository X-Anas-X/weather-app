'use strict';

// Global Dependencies
require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();
const morgan = require('morgan');

// Middlewares Importing
const errorHandler = require('../middleware/500');
const notFoundHandler = require('../middleware/404');
const router = require('./routes/routes');

// Applying Global Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Using the Routers module
app.use(router);

// Using the 404 not found handler
app.use('*',notFoundHandler);

// Using the error handler
app.use(errorHandler);

module.exports = port => {
    const PORT = port || process.env.PORT || 3000;
    app.listen(PORT, ()=>{console.log(`Listening to port ${PORT}`);});
}
