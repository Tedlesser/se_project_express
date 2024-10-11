require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const mainRouter = require("./routes/index");
const { errorHandler } = require("./middleware/error-handler");
const { requestLogger, errorLogger } = require("./middleware/logger");


const { PORT = 3001 } = process.env;

const { JWT_SECRET } = require("./utils/config");

console.log(JWT_SECRET);

// Connecting to the database
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

const app = express();

app.get("/crash-test", () => {
    setTimeout(() => {
      throw new Error("Server will crash now");
    }, 0);
  });

app.use(cors());

// Main router
app.use(express.json());
app.use(requestLogger);
app.use("/", mainRouter);

app.use(errorLogger);

// celebrate error handler
app.use(errors());

// our centralized handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

