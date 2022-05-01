const express = require('express');
const routerActors = express.Router();


// get list of actors

routerActors.get('/.actors', (res,req) => res.status(201).json({message:'all actors'}));


// get an actor by id
routerActors.get('/actors/:ActorID', (req, res) => {
    console.log(req.params.ActorID);
});


module.exports = routerActors;

