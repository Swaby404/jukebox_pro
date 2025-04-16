import express from "express";
const app = express();
export default app;

import morgan from "morgan";

import tracksRouter from "#api/tracks";

app.use(express.json());
app.use(morgan("dev"));

app.use("/tracks", tracksRouter);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    return res.status(400).send(err.message);
  }

  next(err);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Sorry! Something went wrong.");
});
