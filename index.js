const express = require("express");
const res = require("express/lib/response");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const bodyParser = require('body-parser');
const router = require("./routes/movies");
const routerUsers = require("./routes/users");
const swaggerUi = require("swagger-ui-express"); // init swagger
const swaggerDocument = require("./swagger.json");
const passport = require('passport');
require('./passport');


// init app
const app = express();

// init body parser
app.use(bodyParser.urlencoded({extended: true}));

// import auth.js
let auth = require('./auth')(app);

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

app.use("/", router);
app.use("/", routerUsers);

// swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Get requests
app.get("/", (req, res) => {
  res.send("Welcome to my Movie App!");
});

// port listener
app.listen(8080, () => {
  console.log("Your application is listening on Port 8080");
});
