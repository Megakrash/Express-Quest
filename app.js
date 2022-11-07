require("dotenv").config();

const express = require("express");


const app = express();

app.use(express.json());

const port = process.env.APP_PORT;

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);

const movieHandlers = require("./movieHandlers");
const movieUsers = require("./movieUsers");

app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);
app.get("/api/users", movieUsers.getUsers);
app.get("/api/users/:id", movieUsers.getUsersById);

// app.post("/api/movies", movieHandlers.postMovie);
// app.post("/api/users", movieUsers.postUser);

// app.put("/api/movies/:id", movieHandlers.updateMovie);
// app.put("/api/users/:id", movieUsers.updateUser);

app.delete("/api/movies/:id", movieHandlers.deleteMovie);
app.delete("/api/users/:id", movieUsers.deleteUser);

const { validateMovie } = require("./validator.js");
const { validateUser } = require("./validator.js");

app.post("/api/movies", validateMovie, movieHandlers.postMovie);
app.post("/api/users", validateUser, movieUsers.postUser);
app.put("/api/movies/:id", validateMovie, movieHandlers.updateMovie);
app.put("/api/users/:id", validateUser, movieUsers.updateUser);


app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
