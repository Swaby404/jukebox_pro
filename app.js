import express from "express";
const app = express();

import morgan from "morgan";

import tracksRouter from "#api/tracks";
import playlistsRouter from "#api/playlists";
 




app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));


 
app.use("/tracks", tracksRouter);
app.use("/playlists", playlistsRouter);
import usersRouter from "#api/users";




app.use("/users", usersRouter);

app.use((err, _req, res, next) => {
  // A switch statement can be used instead of if statements
  // when multiple cases are handled the same way.
  switch (err.code) {
    // Invalid type
    case "22P02":
      return res.status(400).send(err.message);
    // Unique constraint violation
    case "23505":
    // Foreign key violation
    case "23503":
      return res.status(400).send(err.detail);
    default:
      next(err);
  }
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).send("Sorry! Something went wrong.");
  res.status(500).send("Sorry! Something went wrong.");
});

export default app;

