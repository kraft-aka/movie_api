const express = require('express');
const routerUsers = express.Router();
const bodyParser = require('body-parser');
const uuid = require('uuid');

const users = require('../api/userslist');


routerUsers.use(bodyParser.urlencoded({ extended: true}));
routerUsers.use(bodyParser.json());




// create new user // CREATE
routerUsers.post('/users', (req, res)=> {
    const newUser = req.body;

    if (newUser.username) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser)
    } else {
        res.status(400).send('user needs a name')
    }
});

// update user  //UPDATE
routerUsers.put('/users/:id', (req, res)=> {
    const {id} = req.params;
    const updatedUser = req.body;

    let user = users.find(user => user.id === parseInt(id));

    if (user) {
        user.username = updatedUser.username;
        res.status(200).json(user);
    } else {
        res.status(400).send('no such user.');
    }
});

// add a movie  //CREATE
routerUsers.post('/users/:id/:title', (req, res)=> {
    const {id,title } = req.params;

    let user = users.find(user => user.id === parseInt(id));

    if (user) {
        user.favoriteMovies.push(title);
        res.status(200).send(`${title} has been added to ${id}'s favoriteMovies.`)
    } else {
        res.status(400).send('no such movie.');
    }
});

// remove movie from favorite list   // DELETE
routerUsers.delete('/users/:id/:title', (req, res)=> {
    const {id,title } = req.params;

    let user = users.find(user => user.id === parseInt(id));

    if (user) {
        user.favoriteMovies = user.favoriteMovies.filter((deleteMovie)=> deleteMovie!== title);
        res.status(200).send(`${title} has been removed from ${id}'s favoriteMovies.`)
    } else {
        res.status(400).send('no such movie.');
    }
});

// remove movie from favorite list   // DELETE
routerUsers.delete('/users/:id', (req, res)=> {
    const {id } = req.params;

    let user = users.find(user => user.id === parseInt(id));

    if (user) {
        user = users.filter((user)=> user.id !== parseInt(id));
        res.status(200).send(`user's ${id} has been deleted.`)
    } else {
        res.status(400).send('no such user or id.');
    }
});




module.exports = routerUsers;