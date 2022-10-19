const express = require("express");
const res = require("express/lib/response");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const port = 8080;

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

// Get requests
app.get("/", (req, res) => {
  res.send("Welcome to my Movie App!");
});gfhfgh

app.get("/movies", (req, res) => {
  res.json(topTenMovies);
});

// port listener
app.listen(port || 8080, () => {
  console.log(`App listening at http://localhost:${port}`);
});

// topTen Movies delete it later
const topTenMovies = [
    {
        name: 'The Lord of the Rings',
        genre: 'Fantasy'
    },
    {
        name: 'Aliens',
        genre: 'Action'
    },
    {
        name: 'Toy Story',
        genre: 'Animated'
    },
    {
        name: 'Duck Soup',
        genre: 'Comedy'
    },
    {
        name: 'Casablanca',
        genre: 'Romance'
    },
    {
        name: 'Rocky',
        genre: 'Sports'
    },
    {
        name: 'Good Fellas',
        genre: 'Crime'
    },
    {
        name: 'Taxi Driver',
        genre: 'Drama'
    },
    {
        name: 'High Noon',
        genre: 'Western'
    },
    {
        name: 'Airport',
        genre: 'Disaster'
    }
];
