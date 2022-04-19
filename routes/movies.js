const express = require('express');
const router = express.Router();
const uuid = require('uuid');
const mongoose = require('mongoose');
const Models = require('../models');
const res = require('express/lib/response');
//const movies = require('../api/movies');

const Movies = Models.Movie;
const Users = Models.User;



//------READ-----//
// get all moives              
router.get('/movies', (req, res)=> {
    Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((error)=> {
            console.error(error);
            res.status(500).send('Error: '+ error);
        });
});


//------READ-----//
// get movie by title           
router.get('/movies/:Title', (req, res) => {
    Movies.findOne({ Title: req.params.Title})
        .then((movie)=> {
            res.status(201).json(movie);
        })
        .catch((error)=> {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});

//------READ-----//
// get movie by genre            
router.get('/movies/genre/:name', (req, res) => {
    const { name } = req.params;
    const genre = movies.find(movie => movie.genre.name.toLowerCase() === name.toLocaleLowerCase()).genre;

    if (genre) {
        res.status(200).json(genre);
    } else {
        res.status(400).send('No such genre');
    }
});

//------READ-----//
// get movie by directors name   
router.get('/movies/director/:name', (req, res) => {
    const { name } = req.params;
    const director = movies.find(movie => movie.director.name.toLowerCase() === name.toLowerCase()).director;

    if (director) {
        res.status(200).json(director);
    } else {
        res.status(400).send('No such director');
    }
});







module.exports = router;

