const express = require("express");
const routerUsers = express.Router();
const bodyParser = require("body-parser");
const passport = require("passport");
require("../passport");
const uuid = require("uuid");
const mongoose = require("mongoose");
const Models = require("../models");
const { check, validationResult } = require("express-validator");

// defining document variables from DB
const Movies = Models.Movie;
const Users = Models.User;

// connect to DB local
// mongoose.connect("mongodb://127.0.0.1/myFlixDB", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// connect to MongoDB Atlas
mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// init body parser
routerUsers.use(bodyParser.urlencoded({ extended: true }));
routerUsers.use(bodyParser.json());

// init auth
let auth = require("../auth");

//------CREATE-----//
// create new user //
routerUsers.post(
  "/users",
  [
    // validator is a middleware
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumerical characters-not allowed"
    ).isAlphanumeric(),
    check("Password", "Password is required").isEmpty(),
    check("Email", "Email is required").isEmail(),
  ],
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array });
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
            Password: req.body.Password,
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

// get all users
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

// get a user by username
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

//------UPDATE-----//
// update user
routerUsers.put(
  "/users/:Username",
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumerical characters-not allowed"
    ).isAlphanumeric(),
    check("Password", "Password is required").isEmpty(),
    check("Email", "Email is requird").isEmail(),
  ],
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array });
    }

    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: req.body.Password,
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

//------CREATE-----//
// add a movie to favorite list
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

//------DELETE-----//
// remove movie from favorite list
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

//------DELETE-----//
// remove user
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
