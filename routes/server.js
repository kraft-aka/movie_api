const express = require('express');
const router = express.Router();

const uuid = require('uuid');

const movies = require('../api/movies');




// get all moives 
router.get('/movies', (req, res)=> {
    res.status(200).json(movies);
});

// get movie by title
router.get('/movies/:title',(req, res) => {
    const {title} = req.params;
    const movie = movies.find(movie => movie.title.toLowerCase() === title);
    

    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(400).send('No such movie');
    }
});

// get movie by genre
router.get('/movies/genre/:name',(req, res) => {
    const {name} = req.params;
    const genre = movies.find(movie => movie.genre.name.toLowerCase() === name).genre;
    console.log(genre)

    if (genre) {
        res.status(200).json(genre);
    } else {
        res.status(400).send('No such genre');
    }
});

// get movie by directors name
router.get('/movies/director/:name',(req, res) => {
    const {name} = req.params;
    const director = movies.find(movie => movie.director.name.toLowerCase() === name).director;
    console.log(director)

    if (director) {
        res.status(200).json(director);
    } else {
        res.status(400).send('No such director');
    }
});







module.exports = router;

