require('dotenv').config()

const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const listingsRouter = require('./routes/listings.route');
const psRouter = require('./routes/ps.route');
const cors = require("cors");
const {port} = require("./configs/environment");
const {checkAuth} = require("./middleware/auth");
const {getPageInstance} = require("./controllers/ps.controller");

const app = express();

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(checkAuth)

app.use('/api/listings', listingsRouter);
app.use('/api/ps', psRouter);

app.listen(port, async () => {
    console.log('Starting browser')
    await getPageInstance()
    console.log(`App listening on port ${port}`)
})
