const express = require("express");
const routerActors = express.Router();
const Models = require("../models");
const passport = require("passport");
const bodyParser = require("body-parser");

/**
 * Initialize a document variable from DB
 */
const { Actors } = Models;

routerActors.use(bodyParser.urlencoded({ extended: true }));
routerActors.use(bodyParser.json());

/**
 * Returns all actors from the API with HTTP method GET
 * @function [path]/actors
 * @returns {Object[]} actors
 * @requires passport
 */
routerActors.get(
  "/actors",
  passport.authenticate("jwt", { session: false }),
  (res, req) => {
    Actors.find().then((actors) =>
      res
        .status(201)
        .json(actors)
        .catch((error) => {
          console.log(error);
          res.status(500).send("Error " + error);
        })
    );
  }
);

module.exports = routerActors;
