const express = require("express");
const routerMovies = express.Router();
const uuid = require("uuid");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Models = require("../models");
const passport = require("passport");
require("../passport");
const res = require("express/lib/response");

// defining document variables from DB
const Movies = Models.Movie;
const Users = Models.User;

// init body parser
routerMovies.use(bodyParser.urlencoded({ extended: true }));
routerMovies.use(bodyParser.json());

// init auth
let auth = require("../auth");

//------READ-----//
// get all moives
routerMovies.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

//------READ-----//
// get movie by title
routerMovies.get(
  "/movies/:Title",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ Title: req.params.Title })
      .then((movie) => {
        res.status(201).json(movie);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

//------READ-----//
// get movie by genre
routerMovies.get(
  "/movies/Genre/:Name",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ "Genre.Name": req.params.Name })
      .then((movies) => {
        res.status(201).json(movies.Genre);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

//------READ-----//
// get data about director
routerMovies.get(
  "/movies/Director/:Name",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ "Director.Name": req.params.Name })
      .then((director) => {
        res.status(201).json(director.Director);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

module.exports = routerMovies;
