const express = require("express");
const routerMovies = express.Router();
const bodyParser = require("body-parser");
const Models = require("../models");
const passport = require("passport");
require("../passport");

/**
 * Initialize document variable from DB
 */
const Movies = Models.Movie;

/**
 * Initialize body parsers
 */
routerMovies.use(bodyParser.urlencoded({ extended: true }));
routerMovies.use(bodyParser.json());

/**
 * Returns all movies from API with HTTP method GET
 * @function [path]/movies/
 * @return {Object[]} movies
 * @requires passport
 */
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

/**
 * Returns a single movie by title with HTTP method GET
 * @function [path]/movies/:title
 * @return {Object[]} movie
 * @param {any} title
 * @requires passport
 */
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

/**
 * Returns a movie details/Genre with HTTP method GET
 * @function [path]/movies/genre/:name
 * @returns {Object} genre
 * @requires passport
 */
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

/**
 * Returns a data about movie director with HTTP method GET
 * @function [path]/movies/director/:name
 * @returns {Object} director
 * @requires passport
 */
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
