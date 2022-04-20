const express = require("express");
const router = express.Router();
const uuid = require("uuid");
const mongoose = require("mongoose");
const Models = require("../models");
const res = require("express/lib/response");

const Movies = Models.Movie;
const Users = Models.User;

// connect to DB
mongoose.connect("mongodb://127.0.0.1/myFlixDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//------READ-----//
// get all moives
router.get("/movies", (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

//------READ-----//
// get movie by title
router.get("/movies/:Title", (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      res.status(201).json(movie);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

//------READ-----//
// get movie by genre
router.get("/movies/Genre/:Name", (req, res) => {
  Movies.findOne({ "Genre.Name": req.params.Name })
    .then((movies) => {
      res.status(201).json(movies.Genre);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

//------READ-----//
// get data about director
router.get("/movies/Director/:Name", (req, res) => {
  Movies.findOne({ "Director.Name": req.params.Name })
    .then((director) => {
      res.status(201).json(director.Director);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

module.exports = router;
