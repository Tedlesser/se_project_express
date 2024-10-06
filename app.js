const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors")
const { errors } = require('celebrate');
const mainRouter = require("./routes/index");
const { errorHandler } = require("./middleware/error-handler");
const { requestLogger, errorLogger } = require('./middleware/logger');
require('dotenv').config();

const { PORT = 3001} = process.env; 

// Connecting to the database
mongoose
    .connect("mongodb://127.0.0.1:27017/wtwr_db")
    .then(() => {
        console.log("Connected to DB")
    })
    .catch(console.error);

const app = express();

app.use(cors())

// Main router
app.use(express.json());
app.use(requestLogger);
app.use("/", mainRouter);

app.use(errorLogger)

// celebrate error handler
app.use(errors());

// our centralized handler
app.use(errorHandler);

app.listen (PORT, () => {
    console.log(`server is running on port ${PORT}`);
})

