const express = require("express");
const routerUsers = express.Router();
const bodyParser = require("body-parser");
const passport = require("passport");
require("../passport");
const Models = require("../models");
const { check, validationResult } = require("express-validator");

/**
 * Initialize document variable from DB for User
 */
const Users = Models.User;

/**
 * Initialize body parser
 */
routerUsers.use(bodyParser.urlencoded({ extended: true }));
routerUsers.use(bodyParser.json());

/**
 * Creates new user with HTTP method POST
 * Password is hashed
 * @function [path]/users/
 * @param {JSON} data from register form
 * @returns {Object} user
 *
 */
routerUsers.post(
  "/users",
  [
    // validator is a middleware
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumerical characters-not allowed"
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email is required").isEmail(),
  ],
  (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password); // create var for hashing password for new user
    Users.findOne({ Username: req.body.Username }) //search to see if a user with the requested username already exists
      .then((user) => {
        if (user) {
          // if the user is found, send a message that it already exists
          return res.status(400).send(req.body.Username + " already exists");
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send("Error: " + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

/**
 * Retrieves information about all users with HTTP method GET
 * @function [path]/users/
 * @returns {Object[]} users
 */
routerUsers.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Returns a single user by name with HTTP method GET
 * @function [path]/users/:username
 * @param {string} username
 * @returns {Object} user
 * @requires passport
 */
routerUsers.get(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOne({ Username: req.params.Username })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Updates user's profile with HTTP method PUT
 * @function [path]/users/:username
 * @param {string} username
 * @returns {Object} update user information
 * @requires passport
 */
routerUsers.put(
  "/users/:Username",
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumerical characters-not allowed"
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email is requird").isEmail(),
  ],
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);

    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        },
      },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

/**
 * Adds a movie to a favorite movies list with HTTP method POST
 * @function [path]/users/:username/movies/:movieID/
 * @param {string} username
 * @param {string|number} movieID
 * @returns {any} movieID
 * @requires passport
 */
routerUsers.post(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $push: { FavoriteMovies: req.params.MovieID },
      },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

/**
 * Allows user to remove a movie from favorite movies list
 * with HTTP method DELETE
 * @function [path]/users/:username/movies/:movieID/
 * @param {string} username
 * @param {string | number} movieID
 * @returns {string | number } movieID
 * @requires passport
 */
routerUsers.delete(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $pull: { FavoriteMovies: req.params.MovieID },
      },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

/**
 * Allows user to delete his/her profile with HTTP method DFELETE
 * @function [path]/users/:username
 * @param {string} username
 * @returns {string} succes info after deletion
 * @requires passport
 */
routerUsers.delete(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username }).then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + " was not found");
      } else {
        res.status(200).send(req.params.Username + " was deleted");
      }
    });
  }
);

module.exports = routerUsers;
