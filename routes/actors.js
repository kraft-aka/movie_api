const express = require('express');
const routerActors = express.Router();
const mongoose = require('mongoose');
const Models = require('../models');
const passport = require('passport');
const bodyParser = require("body-parser");

const { Actors} = Models;


routerActors.use(bodyParser.urlencoded({extended:true}));
routerActors.use(bodyParser.json());

// init auth
let auth = require("../auth");


// get list of actors

routerActors.get('/.actors', passport.authenticate("jwt", { session: false }),(res,req) => {
    Actors.find()
    .then((actors) => res.status(201).json(actors)
    .catch((error)=> {
        console.log(error);
        res.status(500).send('Error '+ error);
    }))   
});


// // get an actor by id
// routerActors.get('/actors/:ActorID', (req, res) => {
//     console.log(req.params.ActorID);
// });


module.exports = routerActors;

