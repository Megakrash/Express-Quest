// Imports
require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.json());
const port = process.env.APP_PORT;

// Message de bienvenue
const welcome = (req, res) => {
  res.send("Welcome");
};

app.get("/", welcome);

// Import des deux fichiers de requêtes
const movieUsers = require("./movieUsers");
const movieHandlers = require("./movieHandlers");

//------Public------

// Trouve tous les movies ou par ID
app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);

// Trouve tous les users / par ID 
app.get("/api/users", movieUsers.getUsers);
app.get("/api/users/:id", movieUsers.getUsersById);

// Pour créer un password hashed lors de la création d'un nouvel user
const { hashPassword } = require("./auth.js");
app.post("/api/users", hashPassword, movieUsers.postUser);

// Login du user
const { verifyPassword } = require("./auth.js");

app.post(
  "/api/login",
  movieUsers.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword
);

//------Protect------

const { verifyToken } = require("./auth.js");

// Authentification wall
app.use(verifyToken);

app.put("/api/movies/:id", movieHandlers.updateMovie);
app.post("/api/movies", movieHandlers.postMovie);
app.delete("/api/movies/:id", movieHandlers.deleteMovie);
// Pour valider l'update d'un movie avec tous les champs requis
const { validateMovie } = require("./validator.js");
app.put("/api/movies/:id", validateMovie, movieUsers.updateUser);


// Pour valider l'update d'un utilisateur avec tous les champs requis
const { validateUser } = require("./validator.js");
app.put("/api/users/:id", validateUser, movieUsers.updateUser);
app.delete("/api/users/:id", movieUsers.deleteUser);


// Message console connection serveur 5000
app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
