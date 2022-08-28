const express = require("express");
const jwtSecret = "your_jwt_secret";

const routerLogin = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");

//local passport file
require("./passport");

/**
 * Create JWT token
 * @param {Object} user
 * @returns {Object} user
 */
let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username,
    //this specifies that the token will expire in 7 days
    expiresIn: "7d",
    //this is the algorithm used to "sign" or encode the values of the JWT
    algorithm: "HS256",
  });
};

/**
 * User login, JWT generated with HTTP POST
 * @function [path]/login
 * @param {any} routerActors
 * @returns {Object} user
 * @requires passport
 */

routerLogin.post("/login", (req, res) => {
  passport.authenticate("local", { session: false }, (error, user, info) => {
    if (error || !user) {
      return res.status(400).json({
        message: "Something is not right",
        user: user,
      });
    }
    req.login(user, { session: false }, (error) => {
      if (error) {
        res.send(error);
      }
      let token = generateJWTToken(user.toJSON());
      return res.json({ user, token });
    });
  })(req, res);
});

module.exports = routerLogin;
