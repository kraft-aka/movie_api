const express = require("express");
const routerUsers = express.Router();
const bodyParser = require("body-parser");
const uuid = require("uuid");
const mongoose = require("mongoose");
const Models = require("./models.js");

const users = require("../api/userslist");
const { User } = require("../models");

// references to model names created in models.js
const Movies = Models.Movie;
const Users = Models.User;

// connect to DB
mongoose.connect("mongodb://localhost:27017/myFlixDB", {
  useNewURLParser: true,
  useUnifiedTopology: true,
});

routerUsers.use(bodyParser.urlencoded({ extended: true }));
routerUsers.use(bodyParser.json());

//------CREATE-----//
// create new user //
routerUsers.post("/users", (req, res) => {
  /* const newUser = req.body;
 
     if (newUser.username) {
         newUser.id = uuid.v4();
         users.push(newUser);
         res.status(201).json(newUser)
     } else {
         res.status(400).send('user needs a name')
     }*/
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
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
});

// get all users
routerUsers.get("/users", (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// get a user by username
routerUsers.get("/users/:Username", (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//------UPDATE-----//
// update user
routerUsers.put("/users/:Username", (req, res) => {
  /*const { id } = req.params;
    const updatedUser = req.body;

    let user = users.find(user => user.id === parseInt(id));

    if (user) {
        user.username = updatedUser.username;
        res.status(200).json(user);
    } else {
        res.status(400).send('no such user.');
    }*/
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
});

//------CREATE-----//
// add a movie
routerUsers.post("/users/:Username/movies/:MovieID", (req, res) => {
  /*const { id, title } = req.params;

  let user = users.find((user) => user.id === parseInt(id));

  if (user) {
    user.favoriteMovies.push(title);
    res.status(200).send(`${title} has been added to ${id}'s favoriteMovies.`);
  } else {
    res.status(400).send("no such movie.");
  }*/
  Users.findOneAndUpdate({ Username: req.params.Username}, {
      $push: { favoriteMovies: req.params.MovieID }
  },
  { new: true },
  (err, updatedUser)=> {
      if (err) {
          console.error(err);
          res.status(500).send('Error: ' + err);
      } else {
          res.json(updatedUser);
      }
  });
});

//------DELETE-----//
// remove movie from favorite list
routerUsers.delete("/users/:id/:title", (req, res) => {
  const { id, title } = req.params;

  let user = users.find((user) => user.id === parseInt(id));

  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter(
      (deleteMovie) => deleteMovie !== title
    );
    res
      .status(200)
      .send(`${title} has been removed from ${id}'s favoriteMovies.`);
  } else {
    res.status(400).send("no such movie.");
  }
});

//------DELETE-----//
// remove user 
routerUsers.delete("/users/:Username", (req, res) => {
 /* const { id } = req.params;

  let user = users.find((user) => user.id === parseInt(id));

  if (user) {
    user = users.filter((user) => user.id !== parseInt(id));
    res.status(200).send(`user's ${id} has been deleted.`);
  } else {
    res.status(400).send("no such user or id.");
  }*/
  Users.findOneAndRemove({ Username: req.params.Username})
    .then((user)=> {
        if(!user) {
            res.status(400).send(req.params.Username + ' was not found');
        } else {
            res.status(200).send(req.params.Username + ' was deleted');
        }
    });

});

module.exports = routerUsers;
