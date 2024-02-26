require('dotenv').config()

const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const imagesRouter = require('./routes/images');
const cors = require("cors");
const {port} = require("./configs/environment");

const app = express();

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/api/images', imagesRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
