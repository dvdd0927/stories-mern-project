require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

const cors = require("cors");

// db import
const connectDB = require("./db/connectDB");

// routes import
const storyRoutes = require("./routes/stories");

// middleware
app.use(express.json());
app.use(cors());

// error middleware
const errorHandlerMiddleware = require("./middlewares/error-handler");
const notFoundMiddleware = require("./middlewares/not-found");

// routes
app.use("/api/v1/stories", storyRoutes);

// error routes
app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

// app start
const port = process.env.PORT || 5000;

const start = async () => {
  try {
    // connect to db
    await connectDB(process.env.MONGODB_URI).then(() =>
      console.log("Connected to DB!")
    );

    // start the server
    app.listen(port, () => {
      console.log(`Listening on PORT: ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
