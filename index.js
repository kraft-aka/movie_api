const express = require("express");
const res = require("express/lib/response");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const router = require('./routes/server');
const routerUsers = require('./routes/users');
const movies = require('./api/movies');
const users = require('./api/userslist');
const swaggerUi = require('swagger-ui-express'),// init swagger
swaggerDocument = require('./swagger.json');
const mongoose = require('mongoose');
const Models = require('./models.js');

// references to model names created in models.js
const Movies = Models.Movie;
const Users = Models.User;

// connect to DB 
mongoose.connect('mongodb://localhost:27017/myFlixDB', {useNewURLParser: true, useUnifiedTopology: true});

// init app
const app = express();

// create a write stream (in append mode)
// a "log.txt" file is created in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
    flags: "a",
});

// middlewares
app.use(morgan("combined", { stream: accessLogStream }));
app.use(express.static("public"));
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});

app.use('/', router);
app.use('/', routerUsers);

app.use(
    '/api-docs',
    swaggerUi.serve, 
    swaggerUi.setup(swaggerDocument)
  );




// Get requests
app.get("/", (req, res) => {
    res.send("Welcome to my Movie App!");
});


// port listener
app.listen(8080, () => {
    console.log("Your application is listening on Port 8080");
});

